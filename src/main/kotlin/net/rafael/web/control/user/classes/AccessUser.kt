package net.rafael.web.control.user.classes

import net.rafael.web.control.user.permission.application.UserApplicationPermission
import net.rafael.web.control.user.permission.application.UserApplicationPermissions

//------------------------------
//
// This class was developed by Rafael K.
// On 1/23/2022 at 9:42 PM
// In the project WebControl
//
//------------------------------

class AccessUser(val username: String, val permissions: List<UserApplicationPermission>) {

    fun grandPermission(permission: UserApplicationPermissions, value: Any) {
        for (userPermission in permissions) {
            if (permission == userPermission.key) {
                userPermission.value = value
            }
        }
    }

}