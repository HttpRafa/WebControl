package net.rafael.web.control.console.text;

//------------------------------
//
// This class was developed by Rafael K.
// On 1/31/2022 at 11:13 AM
// In the project WebControl
//
//------------------------------

public class TextHighlighter {

    public static String highlightJson(String textToHighlight) {
        String text = textToHighlight;
        text = text.replaceAll("\\{", "§8{");
        text = text.replaceAll("}", "§8}");
        text = text.replaceAll("\"", "§b\"");
        text = text.replaceAll(":", "§7:");
        return text;
    }

}
