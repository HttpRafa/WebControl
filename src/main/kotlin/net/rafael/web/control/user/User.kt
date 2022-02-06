package net.rafael.web.control.user

import net.rafael.web.control.WebControl
import net.rafael.web.control.network.session.ClientSession
import java.util.UUID

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 4:45 PM
// In the project WebControl
//
//------------------------------

class User(val username: String, val password: String, val uuid: String, val sessions: MutableList<ClientSession>) {

    fun createSession(): ClientSession {
        val session = ClientSession.create()
        sessions.add(session)
        WebControl.webControl.userManager.saveUsers()
        return session
    }

    companion object {

        fun create(username: String, password: String): User {
            return User(username, password, UUID.randomUUID().toString(), mutableListOf())
        }

    }

}