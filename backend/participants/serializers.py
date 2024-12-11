from rest_framework import serializers
from .models import Participant
from .models import Winner
from rest_framework import serializers
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'name', 'designation', 'created_at']
class WinnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Winner
        fields = ['id', 'name', 'designation']