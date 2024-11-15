from django.core.management.base import BaseCommand
from src.apps.api_auth.models import User
from src.apps.notes.models.notes import Note
from src.apps.audio.models.recordings import AudioRecording
import random

class Command(BaseCommand):
    help = "Seed sample data for notes and audio recordings with scattered AUDIO_{id} placeholders in descriptions"

    def handle(self, *args, **kwargs):
        # Create a sample user (or use an existing user)
        user, created = User.objects.get_or_create(
            email="user@example.com",
        )

        # Function to create multiple notes with or without recordings
        def create_notes_with_recordings(note_count: int, max_recordings: int):
            for i in range(note_count):
                note_type = random.choice(["text", "memo"])
                note_title = f"Sample Note {i+1}"
                base_description = f"Sample description for {note_type} note {i+1}." if note_type == "text" else "Voice memo recording with embedded audio:"

                # Create a note
                note = Note.objects.create(
                    user=user,
                    title=note_title,
                    description=base_description,
                    type=note_type
                )

                # Add audio recordings and scatter placeholders in the description for memo notes
                if note_type == "memo":
                    audio_placeholders = []
                    for j in range(random.randint(1, max_recordings)):
                        # Create an audio recording
                        new_recording = AudioRecording.objects.create(
                            note=note,
                            audio_file=f"seed_data/audio.mp3"
                        )
                        # Collect the AUDIO_{id} placeholder
                        audio_placeholders.append(f"[AUDIO_{new_recording.id}]")

                    # Split the base description into words and insert placeholders randomly
                    words = base_description.split()
                    for placeholder in audio_placeholders:
                        insert_position = random.randint(0, len(words))
                        words.insert(insert_position, placeholder)

                    # Join the words back into a full description
                    note.description = " ".join(words)
                    note.save()

        # Create 10 sample notes, each with up to 3 audio recordings
        create_notes_with_recordings(note_count=10, max_recordings=3)

        self.stdout.write(self.style.SUCCESS("Sample data with scattered audio placeholders seeded successfully!"))
