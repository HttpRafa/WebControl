package net.rafael.web.control.network.session

import java.util.UUID

//------------------------------
//
// This class was developed by Rafael K.
// On 1/27/2022 at 5:42 PM
// In the project WebControl
//
//------------------------------

class ClientSession(val session: String) {

    companion object {

        fun create(): ClientSession {
            return ClientSession(UUID.randomUUID().toString() + UUID.randomUUID() + UUID.randomUUID())
        }

    }

}