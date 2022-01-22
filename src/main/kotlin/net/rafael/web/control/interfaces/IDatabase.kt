package net.rafael.web.control.interfaces

import net.rafael.web.control.interfaces.IDatabaseCollection

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 3:17 PM
// In the project WebControl
//
//------------------------------
interface IDatabase {

    fun getKey(): String
    fun getCollections(): List<IDatabaseCollection>

    fun getCollection(key: String): IDatabaseCollection
    fun createCollection(key: String): IDatabaseCollection
    fun deleteCollection(key: String)

}