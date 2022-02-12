import 'package:flutter/material.dart';
import 'package:webcontrol/widgets/appdrawer.dart';

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blue,
        title: const Text("WebControl"),
      ),
      drawer: const AppDrawer(),
      body: Container(),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.api),
        onPressed: () {},
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.android), label: "Application"),
          BottomNavigationBarItem(
              icon: Icon(Icons.android), label: "Applications"),
          BottomNavigationBarItem(
              icon: Icon(Icons.build_sharp), label: "Settings"),
        ],
      ),
    ));
  }
}
