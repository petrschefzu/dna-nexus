# Problem: Random line from a file

You are given a very, very large plain text file where each line contains a plain text string. The file has at most 1 billion lines; lines may have different lengths, but each line has at most 1000 characters.

Your goal is to write a program that will print an arbitrary line from the file. Your program will be run many times (although you don't know exactly how many times it will be run in advance), and you don't know in advance which lines might be selected. Thus, your solution should be optimized to minimize the runtime for each additional execution. The first execution of the program may take longer than subsequent runs, and you may use additional disk storage to improve performance.
Your program should take two command-line arguments: the path of the input file from which to print lines, and the index of the line you want to print. Your program should write the line to standard output.

## Sample input/output

### input_file.txt

- apple
- banana
- orange
- lemon

### command triggers

```bash
random_line input_file.txt 3
Writing index to input_file.txt.idx... done.
lemon
```

```bash
$ random_line input_file.txt 2
orange
```

```bash
$ random_line input_file.txt 0
apple
```

## Application docs

### Tech Stack

- [NodeJS >= 20](https://nodejs.org/docs/latest-v20.x/api/index.html)
- [Typescript](https://www.typescriptlang.org/docs/home)
- [Jest](https://jestjs.io/docs/getting-started)

### Running the application

- clone git repository
- run `npm run install`
- run `npm run read_line fileName lineOfFile`
  - file with given name has to be in the src/files folder, feel free to add yours
- you can also run tests if needed, they should cover all the requirements `npm run test`

### Final note

I prioritized simplicity over a more production-ready structure and naming, while still ensuring everything is of good enough quality for readability. The code doesn't handle all edge cases, but I tried to at least identify some of them.

I've also created a few tests that are fully isolated and clean up after themselves. These tests would be approached a bit differently in a production application.
