# DocSystem

DocSystem is a document sharing and hosting service powered by SvelteKit and BunJS. 

The only current "official" instance is [doc.spamix.se](https://doc.spamix.se)

## Setting up a new instance
### Clone the repository
```
git clone https://github.com/SpamixOfficial/docsystem.git
```
### Dependencies
```
BunJS
MariaDB
PM2
```
Install these dependencies before proceeding further in this tutorial

### Set up the database
Now, set up a new MariaDB database.

Here's an example of how I would do it (including creating a new user)
```
$> sudo mariadb -u root -p
 ...
 ...
MariaDB [(none)]> CREATE USER 'SomeUser'@'localhost' IDENTIFIED BY 'VerySecurePassword1234';
MariaDB [(none)]> CREATE DATABASE docsystem;
MariaDB [(none)]> GRANT ALL PRIVILEGES ON docsystem.* TO 'SomeUser'@'localhost';
MariaDB [(none)]> exit;
```

### Install all dependencies
Cd into the new directory, and install all project dependencies 
```
$> cd docsystem && bun install
```


### Fill out the env file
```env
dbhost=127.0.0.1
dbuser=SomeUser
dbpass=VerySecuredPassword1234
dbname=docsystem
master_password="MASTER_PASSWORD_1234"
```

The master password is the password you'll use to identify yourself when doing administrative actions. Choose wisely!

### Run database generation and migrations
```
$> bun run drizzle:generate && bun run drizzle:migrate
```

### Run the server
```
$> bun run build
$> bun run pm2deploy
```
You should now have a server running on port 3000! How you want to expose this to the world is up to you.

A recommendation for managing the database is cloudbeaver. In the repository I've included a cloudbeaver docker compose file you can use to easily get cloudbeaver up and running. 


## Final words
Have fun, and if you find bugs please notify me and/or commit a fix for them! 

Every inch of help is appreciated :-)