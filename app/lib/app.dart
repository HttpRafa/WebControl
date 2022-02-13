import 'package:flutter/material.dart';
import 'package:webcontrol/screens/login_screen.dart';

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "WebControl",
      theme: ThemeData(),
      home: const LoginScreen()
    );
  }
}
