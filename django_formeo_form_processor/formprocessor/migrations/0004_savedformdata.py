# Generated by Django 2.1.2 on 2019-01-06 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('formprocessor', '0003_delete_question'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedFormData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form_data', models.TextField()),
            ],
        ),
    ]
