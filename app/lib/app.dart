import 'package:flutter/material.dart';
import 'package:webcontrol/screens/Dashboard/home_screen.dart';
import 'package:webcontrol/screens/add_node_screen.dart';
import 'package:webcontrol/screens/login_screen.dart';
import 'package:webcontrol/widgets/bottom_nav_screen.dart';

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "WebControl",
      theme: ThemeData(),
      home: const HomeScreen()
    );
  }
}
