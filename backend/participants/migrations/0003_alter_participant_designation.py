# Generated by Django 4.2.7 on 2024-12-10 16:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('participants', '0002_winner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participant',
            name='designation',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
