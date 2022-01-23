package net.rafael.web.control.user.classes

import net.rafael.web.control.user.permission.node.UserPermission
import java.util.UUID
import net.rafael.web.control.user.permission.node.UserPermissions

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 10:32 PM
// In the project WebControl
//
//------------------------------

class User(val username: String, val password: String, val tokens: MutableList<String>, val permissions: MutableList<UserPermission>, val accessUsers: MutableList<AccessUser>) {

    fun createLogin(): String {
        val token = UUID.randomUUID().toString().replace("-".toRegex(), "") + UUID.randomUUID().toString()
            .replace("-".toRegex(), "") + UUID.randomUUID().toString().replace("-".toRegex(), "")
        tokens.add(token)
        return token
    }

    fun grandPermission(permission: UserPermissions, value: Any) {
        for (userPermission in permissions) {
            if (permission == userPermission.key) {
                userPermission.value = value
            }
        }
    }

}