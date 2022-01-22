package net.rafael.web.control.config

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import net.rafael.web.control.WebControl
import net.rafael.web.control.database.DatabaseType
import java.io.File
import java.io.FileInputStream
import java.io.FileWriter
import java.io.InputStreamReader

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 2:17 PM
// In the project WebControl
//
//------------------------------

class ConfigManager(configFolder: File, val configFile: File) {

    var jsonObject: JsonObject = JsonObject()

    init {

        // Set default config
        val databaseConfig = JsonObject()
        databaseConfig.addProperty("type", DatabaseType.LOCAL.name)

        jsonObject.add("database", databaseConfig)

        if(!configFolder.exists()) {
            configFolder.mkdirs()
        }

        if(!configFile.exists()) {
            configFile.createNewFile()
            saveConfig()
        }

        loadConfig()
    }

    fun loadConfig() {
        WebControl.logger.info("Loading Config...")

        this.jsonObject = JsonParser.parseReader(InputStreamReader(FileInputStream(configFile))).asJsonObject
    }

    fun saveConfig() {
        val gson: Gson = GsonBuilder().disableHtmlEscaping().setPrettyPrinting().serializeNulls().create()

        val fileWriter = FileWriter(configFile)
        fileWriter.write(gson.toJson(this.jsonObject))
        fileWriter.flush()
        fileWriter.close()
    }

}