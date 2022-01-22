package net.rafael.web.control.database.local

import net.rafael.web.control.WebControl.Companion.logger
import net.rafael.web.control.interfaces.IDatabaseAdapter
import java.util.Optional
import net.rafael.web.control.interfaces.IDatabase
import java.io.File
import net.rafael.web.control.database.local.database.LocalDatabase
import com.google.gson.JsonObject
import com.google.gson.JsonArray
import com.google.gson.GsonBuilder
import java.io.FileWriter
import java.io.IOException

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 2:14 PM
// In the project WebControl
//
//------------------------------

class LocalDatabaseAdapter : IDatabaseAdapter {

    override fun connect() {
        logger.info("Starting Local Database...")
        if (!databaseFolder.exists()) {
            databaseFolder.mkdirs()
        }
    }

    override fun disconnect() {

    }

    override fun getDatabase(name: String): Optional<IDatabase> {
        val databaseFile = File(databaseFolder, "$name.json")
        return if (databaseFile.exists()) {
            Optional.of(LocalDatabase(databaseFile))
        } else {
            Optional.empty()
        }
    }

    override fun createDatabase(name: String): Optional<IDatabase> {
        val databaseFile = File(databaseFolder, "$name.json")
        try {
            if (databaseFile.exists()) {
                databaseFile.delete()
                databaseFile.createNewFile()
            }
            val jsonObject = JsonObject()
            jsonObject.addProperty("name", name)
            jsonObject.add("collections", JsonArray())
            val gson = GsonBuilder().disableHtmlEscaping().setPrettyPrinting().serializeNulls().create()
            val fileWriter = FileWriter(databaseFile)
            fileWriter.write(gson.toJson(jsonObject))
            fileWriter.flush()
            fileWriter.close()
            return Optional.of(LocalDatabase(databaseFile))
        } catch (exception: IOException) {
            logger.handleException(exception)
        }
        return Optional.empty()
    }

    override fun createDatabaseIfNotExists(name: String): Optional<IDatabase> {
        return if(getDatabase(name).isEmpty) {
            createDatabase(name)
        } else {
            Optional.empty()
        }
    }

    override fun deleteDatabase(name: String) {
        val databaseFile = File(databaseFolder, "$name.json")
        if (databaseFile.exists()) {
            databaseFile.delete()
        }
    }

    companion object {
        private val databaseFolder = File("database/local/")
    }

}