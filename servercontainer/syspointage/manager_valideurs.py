from . calcul_func import *
from . models import *
from . serializers import *
from . valideurs_emails import *
from . rapport_journalier import Rapportunjour
from rest_framework.views import APIView
from . calcul_func import *

from rest_framework.response import Response 
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny


class managers_valideurs(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def get_valideurs(workflow_conge):
        valideurs = []
        for i in range(1, 5):
            field_name = f"valideur_{i}"
            managers = getattr(workflow_conge, field_name).all()
            for manager in managers:
                user_name = manager.user_name if manager.user_name else ""
                last_name = manager.last_name if manager.last_name else ""
                full_name = f"{user_name} {last_name}".strip()
                valideurs.append({
                    "value": manager.id,
                    "label": full_name,
                    "field": field_name
                })
        return valideurs

    def get(self, request, workflow_id):
        try:
            workflow_conge = WorkflowConge.objects.get(id=workflow_id)
        except WorkflowConge.DoesNotExist:
            return Response({"error": "WorkflowConge does not exist."}, status=404)
        
        valideurs = self.get_valideurs(workflow_conge)

        return Response(valideurs)
    def put(self, request, workflow_id):
        try:
            workflow_conge = WorkflowConge.objects.get(id=workflow_id)
        except WorkflowConge.DoesNotExist:
            return Response({"error": "WorkflowConge does not exist."}, status=404)

        # Update the name of the workflow
        workflow_name = request.data.get('workflow_name')
        if workflow_name:
            workflow_conge.nom = workflow_name

        # Update the type of conge
        conge_type_id = request.data.get('conge_type')
        if conge_type_id:
            try:
                conge_type = motif_abs.objects.get(id=conge_type_id)
                workflow_conge.type_conge = conge_type
            except motif_abs.DoesNotExist:
                return Response({"error": "Motif_abs does not exist."}, status=404)

        # Clear the existing validators
        workflow_conge.valideur_1.clear()
        workflow_conge.valideur_2.clear()
        workflow_conge.valideur_3.clear()
        workflow_conge.valideur_4.clear()
  
        # Update the validators
        for i in range(1, 5):
            field_name = f"valideur_{i}"
            manager_ids = request.data.get(field_name, [])
            managers = NewUser.objects.filter(id__in=manager_ids)
            getattr(workflow_conge, field_name).set(managers)

        # Save the updated workflow_conge object
        workflow_conge.save()

        # Return the updated workflow_conge object as a response
        return Response({"message": "WorkflowConge updated successfully."})
    def delete(self, request, workflow_id):
        # Retrieve the WorkflowConge object or return 404 if not found
        workflow_conge = get_object_or_404(WorkflowConge, id=workflow_id)

        # Delete the WorkflowConge object
        workflow_conge.delete()

        return Response({"message": "WorkflowConge deleted successfully."})  