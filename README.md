Direct Cache Simulator

About
—---------
The Direct Cache Simulator is a JavaScript-based tool designed to simulate a direct-mapped cache. It takes user inputs for various parameters and simulates the cache operation, providing detailed statistics such as the number of cache hits, cache misses, miss penalty, average memory access time, and total memory access time. The results can also be exported to a text file.

Built With
—------------------
Vanilla JavaScript
HTML
CSS

File Structure
—--------------------------
Direct Cache Simulator/
│
├── CSS/
│   └── style.css
│
├── Images/
│   ├── 2.jpg
│   └── 3.jpg
│
├── index.html
└── script.js

How to run the Program
—----------------------------------------
Prerequisites
To run this project, you need a web browser (e.g., Google chrome, Mozilla Firefox, Safari) installed on your computer.

Steps
Download or Clone the Repository
If you haven’t done so already, download or close this repository to your local machine
Open the Direct Cache Simulator Folder
Navigate to the Direct Cache Simulator directory
Open ‘index.html’
Locate the ‘index.html’ file in the root directory of the project
Right-click on the ‘index.html’ and select “Open with” followed by your preferred web browser
Alternatively, you can drag and drop the ‘index.html’ file into your browser window

Features
—--------------
Input Parameters:
Block size
Main memory (MM) size (blocks / words)
Memory access time (in ns)
Cache memory size (blocks / words)
Cache access time (in ns)
Program flow (blocks / words)

Output Parameters:
Number of cache hits
Number of cache misses
Miss penalty
Average access time
Total access time
Snapshot of the cache memory

Export

Reset

Usage
—--------
Input Parameters:
Enter the block size 
Enter the main memory size and select whether the size is in blocks or words
Enter the memory access time
Enter the cache memory size and select whether the size is in blocks or words
Enter the cache access time
Enter the program flow as a comma-separated list of address and select whether the addresses are in blocks or words (use 0 to positive numbers only)

[Validation]
All inputs accept positive integers only
Program flow input accepts 0 to positive integers only
Program flow input accepts integers ranging within main memory size only

Run Simulation:
Click the “Enter” button to run the simulation
The results will be displayed at the right side of the screen

Export:
Click the “Export” button to download the results as a text file

Reset:
Click the “Reset” button to clear all input fields and reset the form

Project Information
—----------------------------------
In partial fulfillment of the requirement for:
CSARCH2: Introduction to Computer Organization and Architecture 2

Submitted to:
Prof. Ronald M. Pascual

De La Salle University
College of Computer Studies 
Department of Computer Technology
Term 3, A.Y. 2023- 2024

Authors
—------------
Chua, Judy
Ha, Eun Ji
Telosa, Arwyn Gabrielle 
Uy, Jasmine Louise
