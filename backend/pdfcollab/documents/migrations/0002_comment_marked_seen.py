# Generated by Django 5.2.1 on 2025-05-30 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='marked_seen',
            field=models.BooleanField(default=False),
        ),
    ]
