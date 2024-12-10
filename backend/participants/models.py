from django.db import models

class Participant(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, blank=True, null=True)  # Optional
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Winner(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"