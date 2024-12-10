from django.db import models

class Participant(models.Model):
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Winner(models.Model):
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.designation})"