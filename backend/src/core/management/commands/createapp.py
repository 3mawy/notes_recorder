import os
import shutil
from typing import Any

from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a new app with a custom structure"

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument("app_name", type=str, help="Name of the new app")

    def handle(self, *args: Any, **kwargs: Any) -> None:
        app_name = kwargs["app_name"]
        custom_structure = [
            "models",
            "views",
            "serializers",
            "tests",
        ]
        parent_dir = "src"

        app_path = os.path.join(parent_dir, app_name)

        os.makedirs(app_path, exist_ok=True)

        # Create the app using the default startapp command
        call_command("startapp", app_name, app_path)

        # Create the custom structure
        for folder in custom_structure:
            folder_path = os.path.join(app_path, folder)
            os.makedirs(folder_path, exist_ok=True)
            # Create an empty __init__.py file in each folder
            open(os.path.join(folder_path, "__init__.py"), "a").close()

        # Remove default files that are no longer needed
        for file_name in ["models.py", "views.py", "tests.py"]:
            file_path = os.path.join(app_path, file_name)
            if os.path.exists(file_path):
                os.remove(file_path)

        # Edit the existing apps.py file to include the full path name
        apps_py_path = os.path.join(app_path, "apps.py")
        with open(apps_py_path, "r") as f:
            lines = f.readlines()

        # Update the name in the existing apps.py
        for i, line in enumerate(lines):
            if line.startswith("    name ="):
                lines[i] = f'    name = "src.apps.{app_name}"\n'
                break

        # Write the changes back to apps.py
        with open(apps_py_path, "w") as f:
            f.writelines(lines)

        # Move the app to the apps directory
        final_app_path = os.path.join(parent_dir, "apps", app_name)
        shutil.move(app_path, final_app_path)

        self.stdout.write(
            self.style.SUCCESS(f'App "{app_name}" created with custom structure.')
        )
