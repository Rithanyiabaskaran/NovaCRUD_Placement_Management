from django.db import models
class Candidate(models.Model):
 candidate_id=models.CharField(max_length=30,unique=True)
 name=models.CharField(max_length=120)
 department=models.CharField(max_length=80)
 cgpa=models.DecimalField(max_digits=4,decimal_places=2)
 company=models.CharField(max_length=120)
 package_lpa=models.DecimalField(max_digits=9,decimal_places=2)
 email=models.EmailField(unique=True)
 status=models.CharField(max_length=20,choices=[("Placed","Placed"),("In Process","In Process"),("Not Placed","Not Placed")],default="In Process")
 created_at=models.DateTimeField(auto_now_add=True)
 def __str__(self): return f"{self.candidate_id} - {self.name}"
