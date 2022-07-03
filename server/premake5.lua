workspace "WebControl"
    architecture "x64"
    configurations { 
        "Debug", 
        "Release", 
        "Dist" 
    }

outputDir = "%{cfg.buildcfg}-%{cfg.system}-%{cfg.architecture}"

group "Dependencies"

group ""
    project "Server"
        location "Server"
        kind "ConsoleApp"
        language "C++"

        targetdir ("target/bin/" .. outputDir .. "/%{prj.name}")
        objdir ("target/obj/" .. outputDir .. "/%{prj.name}")
    
--        pchheader "pch.h"
--        pchsource "%{prj.name}/src/pch.cpp"

        files { 
            "%{prj.name}/src/**.h", 
            "%{prj.name}/src/**.hpp", 
            "%{prj.name}/src/**.cpp" 
        }
    
        includedirs {
            "%{prj.name}/src"
        }

        links {
        }
    
        filter "system:windows"
            cppdialect "C++17"
            staticruntime "Off"
            systemversion "latest"
    
            defines {
                "WC_PLATFORM_WINDOWS"
            }
    
        filter "configurations:Debug"
            defines "WC_DEBUG"
            symbols "On"
    
        filter "configurations:Release"
            defines "WC_RELEASE"
            optimize "On"
    
        filter "configurations:Dist"
            defines "WC_DIST"
            optimize "On"