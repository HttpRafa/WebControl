package net.rafael.web.control.database.local.database

import java.io.File
import net.rafael.web.control.interfaces.IDatabase
import net.rafael.web.control.interfaces.IDatabaseCollection

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 3:16 PM
// In the project WebControl
//
//------------------------------

class LocalDatabase(val databaseFile: File) : IDatabase {

    override fun getKey(): String {
        TODO("Not yet implemented")
    }

    override fun getCollections(): List<IDatabaseCollection> {
        TODO("Not yet implemented")
    }

    override fun getCollection(key: String): IDatabaseCollection {
        TODO("Not yet implemented")
    }

    override fun createCollection(key: String): IDatabaseCollection {
        TODO("Not yet implemented")
    }

    override fun deleteCollection(key: String) {
        TODO("Not yet implemented")
    }

}