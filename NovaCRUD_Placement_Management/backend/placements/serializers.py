from rest_framework import serializers
from .models import Candidate
class CandidateSerializer(serializers.ModelSerializer):
 class Meta:
  model=Candidate
  fields=["id","candidate_id","name","department","cgpa","company","package_lpa","email","status","created_at"]
 def validate_cgpa(self,v):
  if v<0 or v>10: raise serializers.ValidationError("CGPA must be between 0 and 10.")
  return v
 def validate_package_lpa(self,v):
  if v<0: raise serializers.ValidationError("Package cannot be negative.")
  return v
