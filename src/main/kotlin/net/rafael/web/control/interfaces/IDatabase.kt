package net.rafael.web.control.interfaces

import net.rafael.web.control.interfaces.IDatabaseCollection
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 3:17 PM
// In the project WebControl
//
//------------------------------
interface IDatabase {

    val name: String
    fun getCollections(): MutableList<IDatabaseCollection>

    fun getCollection(key: String): Optional<IDatabaseCollection>
    fun createCollection(key: String): Optional<IDatabaseCollection>
    fun deleteCollection(key: String)

}