import 'package:flutter/material.dart';
import 'package:myapp/screens/login_page.dart';
// import 'screens/login_page.dart';
// import 'screens/signup_page.dart';
// import 'screens/home_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Cell',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LoginPage(), // You can change this to any page you want to start with.
    );
  }
}
