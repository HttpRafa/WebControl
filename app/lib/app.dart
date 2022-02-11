import 'package:flutter/material.dart';

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.green,
        title: const Text("Test"),
      ),
      body: const Text("Test"),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {},
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Test"),
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Test"),
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Test"),
        ],
      ),
      drawer: const Drawer(
        child: Text("A Drawer"),
      ),
    ));
  }
}
