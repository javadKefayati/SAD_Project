# Generated by Django 4.0.6 on 2022-08-20 19:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_fileaccess_user_file_type_fileaccess'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='library',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.library'),
        ),
    ]