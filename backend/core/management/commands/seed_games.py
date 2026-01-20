import random
from datetime import date
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Game, LibraryEntry

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with 10 trending games and ensures they appear in the trending section.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding games...')

        games_data = [
            {
                "title": "The Legend of Zelda: Breath of the Wild",
                "description": "Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series.",
                "developer": "Nintendo EPD",
                "publisher": "Nintendo",
                "release_date": date(2017, 3, 3),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
                "average_rating": 9.8,
                "genre": "Action-Adventure"
            },
            {
                "title": "Elden Ring",
                "description": "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
                "developer": "FromSoftware Inc.",
                "publisher": "Bandai Namco Entertainment",
                "release_date": date(2022, 2, 25),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
                "average_rating": 9.7,
                "genre": "RPG"
            },
            {
                "title": "Baldur's Gate 3",
                "description": "Baldur's Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power.",
                "developer": "Larian Studios",
                "publisher": "Larian Studios",
                "release_date": date(2023, 8, 3),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/1/12/Baldur%27s_Gate_3_cover_art.jpg",
                "average_rating": 9.9,
                "genre": "RPG"
            },
            {
                "title": "God of War Ragnarök",
                "description": "Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.",
                "developer": "Santa Monica Studio",
                "publisher": "Sony Interactive Entertainment",
                "release_date": date(2022, 11, 9),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg",
                "average_rating": 9.6,
                "genre": "Action-Adventure"
            },
            {
                "title": "Cyberpunk 2077",
                "description": "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
                "developer": "CD Projekt Red",
                "publisher": "CD Projekt",
                "release_date": date(2020, 12, 10),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
                "average_rating": 8.9,
                "genre": "RPG"
            },
            {
                "title": "The Witcher 3: Wild Hunt",
                "description": "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.",
                "developer": "CD Projekt Red",
                "publisher": "CD Projekt",
                "release_date": date(2015, 5, 19),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
                "average_rating": 9.8,
                "genre": "RPG"
            },
            {
                "title": "Red Dead Redemption 2",
                "description": "Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age.",
                "developer": "Rockstar Studios",
                "publisher": "Rockstar Games",
                "release_date": date(2018, 10, 26),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg",
                "average_rating": 9.9,
                "genre": "Action-Adventure"
            },
            {
                "title": "Hades",
                "description": "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.",
                "developer": "Supergiant Games",
                "publisher": "Supergiant Games",
                "release_date": date(2020, 9, 17),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg",
                "average_rating": 9.5,
                "genre": "Roguelike"
            },
            {
                "title": "Grand Theft Auto V",
                "description": "Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.",
                "developer": "Rockstar North",
                "publisher": "Rockstar Games",
                "release_date": date(2013, 9, 17),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
                "average_rating": 9.7,
                "genre": "Action-Adventure"
            },
            {
                "title": "Minecraft",
                "description": "Prepare for an adventure of limitless possibilities as you build, mine, battle mobs, and explore the ever-changing Minecraft landscape.",
                "developer": "Mojang Studios",
                "publisher": "Mojang Studios",
                "release_date": date(2011, 11, 18),
                "cover_image_url": "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
                "average_rating": 9.5,
                "genre": "Sandbox"
            }
        ]

        created_games = []
        for data in games_data:
            game, created = Game.objects.update_or_create(
                title=data['title'],
                defaults=data
            )
            if created:
                self.stdout.write(f'Created game: {game.title}')
            else:
                self.stdout.write(f'Updated game: {game.title}')
            created_games.append(game)

        # Create dummy users to simulate popularity
        self.stdout.write('Creating dummy users for popularity simulation...')
        dummy_users = []
        for i in range(1, 11):
            username = f'dummy_gamer_{i}'
            email = f'dummy{i}@example.com'
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'role': 'GAMER'
                }
            )
            if created:
                user.set_password('password123')
                user.save()
            dummy_users.append(user)

        # Assign library entries to make games "trending"
        # The first game gets 10 users, second gets 9, etc.
        self.stdout.write('Assigning library entries...')
        for i, game in enumerate(created_games):
            users_to_add = dummy_users[:len(dummy_users) - i] # 10, 9, 8... users
            for user in users_to_add:
                LibraryEntry.objects.get_or_create(
                    user=user,
                    game=game,
                    defaults={'status': 'PLAYING'}
                )
            self.stdout.write(f'Game "{game.title}" added to {len(users_to_add)} libraries.')

        self.stdout.write(self.style.SUCCESS('Successfully seeded games and simulated trending status.'))
