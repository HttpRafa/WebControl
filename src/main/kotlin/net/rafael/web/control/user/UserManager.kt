package net.rafael.web.control.user

import net.rafael.web.control.interfaces.ISaveable
import net.rafael.web.control.interfaces.ILoadable
import net.rafael.web.control.user.classes.User
import java.util.LinkedList

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 10:31 PM
// In the project WebControl
//
//------------------------------

class UserManager : ISaveable, ILoadable {

    val users: List<User> = LinkedList()

    override fun save() {

    }

    override fun load() {

    }

}