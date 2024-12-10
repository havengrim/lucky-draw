# urls.py
from django.urls import path
from . import views
from .views import SaveWinnersView
from .views import (
    ParticipantListCreateView,
    ParticipantRetrieveDeleteView,
    UploadCSVView,
    SaveWinnersView,
    DeleteAllWinnersView,
)
urlpatterns = [
    path('participants/', views.ParticipantListCreateView.as_view(), name='participant_list_create'),
    path('participants/<int:pk>/', views.ParticipantRetrieveDeleteView.as_view(), name='participant_retrieve_delete'),
    path('upload_csv/', views.UploadCSVView.as_view(), name='upload_csv'),  # Add this line for the CSV upload
    path('winners/', SaveWinnersView.as_view(), name='save_winners'),
    path('winners/delete-all/', DeleteAllWinnersView.as_view(), name='delete-all-winners'),
]

