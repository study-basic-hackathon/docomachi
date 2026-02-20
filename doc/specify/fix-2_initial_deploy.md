修正後マージして再度デプロイ実行したところ、以下のようなログが出ており、デプロイに失敗しました。原因を調査して修正してください。必要であればGitHubのテンプレートhttps://github.com/aws-samples/amplify-next-templateを参考にしてください。

0

2026-02-20T12:27:54.525Z [INFO]: # Build environment configured with Standard build compute type: 8GiB Memory, 4vCPUs, 128GB Disk Space

1

2026-02-20T12:27:55.290Z [INFO]: # Cloning repository: git@github.com:study-basic-hackathon/docomachi.git

2

2026-02-20T12:27:56.642Z [INFO]: 

3

2026-02-20T12:27:56.642Z [INFO]: Cloning into 'docomachi'...

4

2026-02-20T12:27:56.643Z [INFO]: # Checking for Git submodules at: /codebuild/output/src358220408/src/docomachi/.gitmodules

5

2026-02-20T12:27:56.650Z [INFO]: # Retrieving environment cache...

6

2026-02-20T12:27:56.696Z [WARNING]: ! Unable to write cache: {"code":"ERR_BAD_REQUEST","message":"Request failed with status code 404"})}

7

2026-02-20T12:27:56.696Z [INFO]: ---- Setting Up SSM Secrets ----

8

2026-02-20T12:27:56.696Z [INFO]: SSM params {"Path":"/amplify/d1qehmt9cnyqvg/main/","WithDecryption":true}

9

2026-02-20T12:27:56.741Z [WARNING]: !Failed to set up process.env.secrets

10

2026-02-20T12:27:57.152Z [INFO]: # No package override configuration found.

11

2026-02-20T12:27:57.155Z [INFO]: # Retrieving cache...

12

2026-02-20T12:27:57.209Z [INFO]: # Retrieved cache

13

2026-02-20T12:28:02.311Z [INFO]: ## Starting Backend Build

14

                                 ## Checking for associated backend environment...

15

                                 ## No backend environment association found, continuing...

16

                                 ## Completed Backend Build

17

2026-02-20T12:28:02.318Z [INFO]: {"backendDuration": 0}

18

                                 ## Starting Frontend Build

19

                                 # Starting phase: preBuild

20

                                 # Executing command: npm install

21

2026-02-20T12:28:20.153Z [INFO]: > docomachi@0.1.0 prepare

22

                                 > husky install

23

2026-02-20T12:28:20.223Z [WARNING]: husky - install command is DEPRECATED

24

2026-02-20T12:28:20.234Z [INFO]: added 1 package, and audited 2 packages in 13s

25

2026-02-20T12:28:20.234Z [INFO]: 1 package is looking for funding

26

                                 run `npm fund` for details

27

2026-02-20T12:28:20.235Z [INFO]: found 0 vulnerabilities

28

2026-02-20T12:28:20.242Z [INFO]: # Completed phase: preBuild

29

                                 # Starting phase: build

30

                                 # Completed phase: build

31

2026-02-20T12:28:20.242Z [INFO]: ## Completed Frontend Build

32

2026-02-20T12:28:20.259Z [INFO]: ## Build completed successfully

33

2026-02-20T12:28:20.260Z [INFO]: # Starting caching...

34

2026-02-20T12:28:20.263Z [INFO]: # Creating cache artifact...

35

2026-02-20T12:28:20.278Z [INFO]: # Created cache artifact

36

2026-02-20T12:28:20.278Z [INFO]: # Uploading cache artifact...

37

2026-02-20T12:28:20.363Z [INFO]: # Uploaded cache artifact

38

2026-02-20T12:28:20.363Z [INFO]: # Caching completed

39

2026-02-20T12:28:20.368Z [ERROR]: !!! CustomerError: Artifact directory doesn't exist: dist