package net.rafael.web.control.user

import net.rafael.web.control.WebControl.Companion.logger
import net.rafael.web.control.user.classes.User

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 4:08 PM
// In the project WebControl
//
//------------------------------

class UserManager {

    lateinit var users: List<User>

    init {
        logger.info("Loading users...")
    }

}