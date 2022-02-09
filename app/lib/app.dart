import 'package:flutter/material.dart';
import 'package:webcontrol/screens/location_detail/location_detail.dart';

class App extends StatelessWidget {

  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const LocationDetail(),
      theme: ThemeData(
        // Define the default brightness and colors.
        brightness: Brightness.light,
        primaryColor: Colors.lightBlue[800],

        // Define the default font family.
        fontFamily: 'Montserrat',

        // Define the default `TextTheme`. Use this to specify the default
        // text styling for headlines, titles, bodies of text, and more.
        textTheme: const TextTheme(
          headline1: TextStyle(fontSize: 30.0, fontWeight: FontWeight.normal),
          headline6: TextStyle(fontSize: 20.0, fontStyle: FontStyle.normal),
          bodyText2: TextStyle(fontSize: 14.0, fontFamily: 'Montserrat'),
          bodyText1: TextStyle(fontSize: 18.0, fontFamily: 'Montserrat'),
        ),
      ),
    );
  }

}