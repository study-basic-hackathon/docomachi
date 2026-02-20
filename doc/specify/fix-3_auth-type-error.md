Amplifyでのデプロイ時にamplify/auth/resource.ts:6:28でのエラーが確認されましたので修正してください。

0

2026-02-20T13:38:00.105Z [INFO]: # Build environment configured with Standard build compute type: 8GiB Memory, 4vCPUs, 128GB Disk Space

1

2026-02-20T13:38:00.823Z [INFO]: # Cloning repository: git@github.com:study-basic-hackathon/docomachi.git

2

2026-02-20T13:38:01.965Z [INFO]: 

3

2026-02-20T13:38:01.965Z [INFO]: Cloning into 'docomachi'...

4

2026-02-20T13:38:01.966Z [INFO]: # Switching to commit: 30cdc2a4a659c4b225e14d23bbf98a07242b8ed9

5

2026-02-20T13:38:01.984Z [INFO]: Note: switching to '30cdc2a4a659c4b225e14d23bbf98a07242b8ed9'.

6

                                 You are in 'detached HEAD' state. You can look around, make experimental

7

                                 changes and commit them, and you can discard any commits you make in this

8

                                 state without impacting any branches by switching back to a branch.

9

                                 If you want to create a new branch to retain commits you create, you may

10

                                 do so (now or later) by using -c with the switch command. Example:

11

                                 git switch -c <new-branch-name>

12

                                 Or undo this operation with:

13

                                 git switch -

14

                                 Turn off this advice by setting config variable advice.detachedHead to false

15

                                 HEAD is now at 30cdc2a Merge pull request #8 from study-basic-hackathon/005-frontend-template-structure

16

2026-02-20T13:38:02.093Z [INFO]: Successfully cleaned up Git credentials

17

2026-02-20T13:38:02.093Z [INFO]: # Checking for Git submodules at: /codebuild/output/src4287521713/src/docomachi/.gitmodules

18

2026-02-20T13:38:02.101Z [INFO]: # Retrieving environment cache...

19

2026-02-20T13:38:02.134Z [WARNING]: ! Unable to write cache: {"code":"ERR_BAD_REQUEST","message":"Request failed with status code 404"})}

20

2026-02-20T13:38:02.134Z [INFO]: ---- Setting Up SSM Secrets ----

21

2026-02-20T13:38:02.134Z [INFO]: SSM params {"Path":"/amplify/d1qehmt9cnyqvg/main/","WithDecryption":true}

22

2026-02-20T13:38:02.181Z [WARNING]: !Failed to set up process.env.secrets

23

2026-02-20T13:38:02.579Z [INFO]: # No package override configuration found.

24

2026-02-20T13:38:02.583Z [INFO]: # Retrieving cache...

25

2026-02-20T13:38:02.698Z [INFO]: # Extracting cache...

26

2026-02-20T13:38:02.705Z [INFO]: # Extraction completed

27

2026-02-20T13:38:02.705Z [INFO]: # Retrieved cache

28

2026-02-20T13:38:07.008Z [INFO]: ## Starting Backend Build

29

                                 ## Checking for associated backend environment...

30

                                 ## No backend environment association found, continuing...

31

                                 ## Completed Backend Build

32

2026-02-20T13:38:07.014Z [INFO]: {"backendDuration": 0}

33

                                 ## Starting Frontend Build

34

                                 # Starting phase: preBuild

35

                                 # Executing command: npm ci

36

2026-02-20T13:39:10.363Z [INFO]: > docomachi@0.1.0 prepare

37

                                 > husky install

38

2026-02-20T13:39:10.403Z [WARNING]: husky - install command is DEPRECATED

39

2026-02-20T13:39:10.418Z [INFO]: added 700 packages, and audited 701 packages in 59s