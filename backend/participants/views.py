from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Participant
from .serializers import ParticipantSerializer
import csv
from io import StringIO
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Winner
from .serializers import WinnerSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.db import models

# Existing views for listing, creating, and retrieving participants
class ParticipantListCreateView(generics.ListCreateAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

class ParticipantRetrieveDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

# New view for handling CSV uploads
class UploadCSVView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided.'}, status=400)

        file = request.FILES['file']
        decoded_file = file.read().decode('utf-8')
        csv_data = StringIO(decoded_file)
        csv_reader = csv.reader(csv_data)

        participants = []
        for row in csv_reader:
            if len(row) >= 2:  # Assuming CSV has 'name' and 'email'
                name, email = row[0], row[1]
                participant = Participant(name=name, email=email)
                participants.append(participant)

        if participants:
            Participant.objects.bulk_create(participants)
            return Response({"message": "Participants uploaded successfully."}, status=200)
        
        return Response({"error": "No valid data found in CSV."}, status=400)

class SaveWinnersView(APIView):
    def post(self, request, *args, **kwargs):
        winners_data = request.data.get('winners', [])
        
        # Serialize and save each winner
        for winner in winners_data:
            serializer = WinnerSerializer(data=winner)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Winners saved successfully"}, status=status.HTTP_201_CREATED)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    # Add other fields if needed, such as a reference to the event, raffle, etc.

    def __str__(self):
        return self.name
    
    def get(self, request, *args, **kwargs):
        winners = Winner.objects.all()  # Get all winners
        serializer = WinnerSerializer(winners, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DeleteAllWinnersView(APIView):
    def delete(self, request, *args, **kwargs):
        winners_deleted, _ = Winner.objects.all().delete()  # Delete all winners
        return Response({"message": f"{winners_deleted} winners deleted successfully."}, status=status.HTTP_200_OK)