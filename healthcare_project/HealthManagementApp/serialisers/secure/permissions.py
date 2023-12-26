from rest_framework.permissions import BasePermission

#####
### To understand the role values, check the "healthcare_project/HealthManagementApp/models/roles.py" file
#####

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == '1'



class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == '2'


# class IsAdmin(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == '3'