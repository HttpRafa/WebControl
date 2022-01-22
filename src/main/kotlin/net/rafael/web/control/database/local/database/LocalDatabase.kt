package net.rafael.web.control.database.local.database

import com.google.gson.JsonArray
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import net.rafael.web.control.database.local.collection.LocalDatabaseCollection
import java.io.File
import net.rafael.web.control.interfaces.IDatabase
import net.rafael.web.control.interfaces.IDatabaseCollection
import java.io.FileInputStream
import java.io.InputStreamReader

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 3:16 PM
// In the project WebControl
//
//------------------------------

class LocalDatabase(override val key: String, val databaseFile: File) : IDatabase {

    override fun getCollections(): MutableList<IDatabaseCollection> {
        val collectionList: MutableList<IDatabaseCollection> = mutableListOf()

        val jsonObject: JsonObject = JsonParser.parseReader(InputStreamReader(FileInputStream(databaseFile))).asJsonObject
        val collections: JsonArray = jsonObject.get("collections").asJsonArray

        for (collectionObject in collections) {
            val collection = collectionObject.asJsonObject
            val key: String = collection.get("key").asString
            val data: JsonArray = collection.get("data").asJsonArray

            collectionList.add(LocalDatabaseCollection(data, key))
        }

        return collectionList
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