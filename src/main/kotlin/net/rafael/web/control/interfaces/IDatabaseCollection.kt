package net.rafael.web.control.interfaces

import com.google.gson.JsonArray

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 3:20 PM
// In the project WebControl
//
//------------------------------
interface IDatabaseCollection {

    val key: String
    val data: JsonArray

}