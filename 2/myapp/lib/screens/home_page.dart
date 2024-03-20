import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('E-Cell'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 200,
              decoration: const BoxDecoration(
                  // image: DecorationImage(
                  // image: AssetImage('#'), // Add banner image here
                  // fit: BoxFit.cover,
                  // ),
                  ),
            ),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'E-Cell IIT Bombay',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                "The Entrepreneurship Cell (E-Cell) of IIT Bombay has been inspiring Entrepreneurs since 1998 and is Asia's largest student-run entrepreneurship-promoting body as designated by Thomson Reuters.",
                style: TextStyle(
                  fontSize: 16,
                ),
                textAlign: TextAlign.justify, 
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                onPressed: () {
                  // Handle button press
                },
                child: const Text('Know More'),
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'What is E-Cell?',
                style: TextStyle(
                  color: Colors.orange,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center, 
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'E-Cell IIT Bombay helps the hustling startups and young professionals via dynamic workshops, thought-provoking speaker sessions, high-stakes business plan competitions, and numerous other game-changing initiatives throughout the year to create a crucible for innovation. We stand as pillars of support for budding entrepreneurs, providing them with personalized guidance from experienced mentors, crucial funding opportunities, and a robust network that can change the course of their journey forever!',
                style: TextStyle(
                  fontSize: 16,
                ),
                textAlign: TextAlign.justify, 
              ),
            ),
          ],
        ),
      ),
    );
  }
}
