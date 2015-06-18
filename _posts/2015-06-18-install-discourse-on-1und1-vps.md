---
layout: post
title: "Install Discourse on 1und1 Virtual Server L Centos 6 x64"
modified:
categories: 
excerpt: "his post is a slightly modified version from a step by step tutorial. I've encountered a few problems following that guide since the extremely cheap server I use has a different configuration by 1und1. Some adjustments are added here in order to avoid the problems I met back then."
tags: []
comments: true
image:
  feature: lamp.jpg
date: 2015-06-18T22:24:00+02:00
---

> This post is a slightly modified version from a step by step tutorial [here](https://www.digitalocean.com/community/tutorials/how-to-install-discourse-on-a-centos-6-4-x64-vps). I've encountered a few problems following that guide since the extremely cheap server I use has a different configuration by 1und1. Some adjustments are added here in order to avoid the problems I met back then.

---
<section id="table-of-contents" class="toc">
  <header>
    <h3>Overview</h3>
  </header>
<div id="drawer" markdown="1">
*  Auto generated table of contents
{:toc}
</div>
</section><!-- /#table-of-contents -->

##Step 1: OS Configuration

here are a handful of prerequisites for running Discourse; this tutorial will assume a fresh Centos 6 VPS.

###Add Swap Space

If you're running a VPS with less than 2 GB of RAM, you'll need to enable swap on your VPS. If you do not do so, some build steps are likely to fail.

This tutorial has instructions on enabling swap for CentOS 6. For smaller VPS, add at least 1 GB of swap space.

###Create a local, non-root user

Most steps will be run as a non-root user with sudo access. [This tutorial](https://www.digitalocean.com/community/tutorials/how-to-add-and-delete-users-on-ubuntu-12-04-and-centos-6) will run you through creating a user account and granting it sudo power.

###Create a non-root user that will run Discourse

You'll also need a user account which will run Discourse. It's best for this to be a different account from your own. discourse would be a good choice.

You can create the sudo user by opening the sudoers file with this command:

{% highlight php %}
sudo /usr/sbin/visudo
{% endhighlight %}


Adding the user’s name and the same permissions as root under the the user privilege specification will grant them the sudo privileges.

{% highlight php %}
# User privilege specification
root    ALL=(ALL:ALL) ALL 
newuser	ALL=(ALL:ALL) ALL
{% endhighlight %}

###Add the EPEL repository

EPEL stands for Extra Packages for Enterprise Linux, and it has some packages we'll need to install that are not part of the base CentOS repositories.

Log in as your local user and run:

{% highlight php %}
sudo su -c 'rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm'
{% endhighlight %}

###Install required packages

These are pre-requisites for Discourse or its pre-requisites.

{% highlight php %}
sudo yum install gcc-c++ patch readline readline-devel zlib zlib-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison iconv-devel ruby-devel libxml2 libxml2-devel libxslt libxslt-devel git
{% endhighlight %}

###Install and start Redis

Redis is an open-source key value data store used by Discourse.

{% highlight php %}
sudo yum install redis.x86_64
sudo chkconfig --add redis
sudo chkconfig --level 345 redis on
sudo /etc/init.d/redis start
{% endhighlight %}

##Step 2: Install ngnix

Ngnix is a lightweight web server and reverse proxy that will be used to reverse proxy connections to Discourse.

###Add repository

ngnix is not in the central CentOS repositories, so you will have to add their repository for yum to be able to install ngnix.

Create a text file /etc/yum.repos.d/nginx.repo:

{% highlight php %}
sudo vi /etc/yum.repos.d/nginx.repo
{% endhighlight %}

Paste in this content:

{% highlight php %}
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/6/$basearch/
gpgcheck=0
enabled=1
{% endhighlight %}

Once that's installed, you need to refresh the yum package list and then install ngnix.

{% highlight php %}
sudo yum upgrade
sudo yum install nginx.x86_64
{% endhighlight %}

##Step 3: Install PostgreSQL

Discourse uses PostgreSQL for its data backend. While the EPEL contains packages for PostgreSQL, it's fairly outdated. This will install a newer package from PostgreSQL's repository.

###Disable CentOS repository

First we'll tell yum to not look at packages from the core CentOS repository. To do this, edit the file /etc/yum.repos.d/CentOS-Base.repo.

{% highlight php %}
sudo vi /etc/yum.repos.d/CentOS-Base.repo
{% endhighlight %}

Add the line:

{% highlight php %}
exclude=postgresql*
{% endhighlight %}

under the [base] and [updates] sections of this file.

###Install the PostgreSQL repository

Now we'll register PostgreSQL's repository with yum.

{% highlight php %}
sudo curl -O http://yum.postgresql.org/9.1/redhat/rhel-6-i386/pgdg-centos91-9.1-4.noarch.rpm
sudo rpm -ivh pgdg-centos91-9.1-4.noarch.rpm 
Install the PostgreSQL server
{% endhighlight %}

This will install the server and some development packages needed by Discourse, start the server, initialize the database, and set it to start on reboot.

{% highlight php %}
sudo yum install postgresql91-server.x86_64 postgresql91-contrib.x86_64 postgresql91-devel.x86_64
sudo service postgresql-9.1 initdb
sudo service postgresql-9.1 start
sudo chkconfig postgresql-9.1 on
{% endhighlight %}


###Grant permissions to users

Now tell PostgreSQL about our users and give them permission to access the database.

{% highlight php %}
sudo -u postgres createuser -s root
sudo -u postgres createuser -s discourse
{% endhighlight %}

##Step 4: Install rvm and Ruby

Ruby and rvm will be installed in single-user context for the discourse user.

###Install rvm

Become the discourse user and install the stable branch of rvm:

{% highlight php %}
sudo su - discourse
\curl -s -S -L https://get.rvm.io | bash -s stable
{% endhighlight %}

rvm will add some environment setup to the login scripts for the discourse user; to make sure these are set it's easiest to log out then back in.

{% highlight php %}
exit
sudo su - discourse
{% endhighlight %}

###Verify packages rvm requires are installed

This will make sure the environment is set up correctly and rvm is ready to work. Again, as the discourse user, run:

{% highlight php %}
rvm --autolibs=read-fail requirements
{% endhighlight %}

This should return that no additional packages are required by rvm.

###Install ruby

As the discourse user, install a local ruby environment and bundler:

{% highlight php %}
rvm install 2.2.2
$ source /home/discourse/.rvm/scripts/rvm
rvm use 2.2.2 --default 
gem install bundler 
{% endhighlight %}


###Tweak ruby configuration

By default, the gem builder will not be able to find the support libraries and binaries for the system's PostgreSQL server. In order for this gem to build, this will tell bundle to pass commandline arguments when it builds the PostgresSQL library.

Still as the discourse user, run:

{% highlight php %}
bundle config build.pg --with-pgsql-lib=/usr/pgsql-9.1/lib --with-pg-config=/usr/pgsql-9.1/bin/pg_config
{% endhighlight %}

##Step 5: Install and Configure Discourse

Now the system is ready to build and run Discourse.

###Build Discourse

As the discourse user, pull down the Discourse source using git. This will clone the Discourse git tree to a sub-folder discourse:

{% highlight php %}
git clone git://github.com/discourse/discourse.git discourse
{% endhighlight %}

Once that has copied the source locally, build Discourse:

{% highlight php %}
cd discourse
bundle install --deployment --without test
{% endhighlight %}

If you encounter problem in this step, try this:

{% highlight php %}
bundle install --no-deployment 
gem install ember-source -v=1.0.0.rc6.2 
bundle
{% endhighlight %}

###Configure Discourse

Copy the example configuration files so Discourse will find them:

{% highlight php %}
cd config
cp database.yml.production-sample database.yml
cp redis.yml.sample redis.yml
cp discourse.pill.sample discourse.pill
cp environments/production.rb.sample environments/production.rb
{% endhighlight %}

You'll need to edit database.yml. Change the host_names line to your server's hostname.

###Create database

Return to the discourse directory, and as the discourse user run:

{% highlight php %}
cd ~/discourse
createdb discourse
RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ENV=production rake db:migrate
RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ENV=production rake assets:precompile
{% endhighlight %}

The precompile step can take several minutes without printing any output to the screen, so it may appear like the process has hung.

###Fix permissions

By default the webserver will not be able to access the discourse directory. To grant more broad permissions, run this as the discourse user:

{% highlight php %}
cd ~
chmod og+rx /home/discourse
Install and configure bluepill
{% endhighlight %}

Bluepill is a process monitoring tool that Discourse uses to monitor itself. Install and configure it to start on boot:

{% highlight php %}
gem install bluepill
echo 'alias bluepill="NOEXEC_DISABLE=1 bluepill --no-privileged -c ~/.bluepill"' >> ~/.bash_profile
rvm wrapper $(rvm current) bootup bluepill
rvm wrapper $(rvm current) bootup bundle
{% endhighlight %}

###Run Discourse

Discourse is now ready to start up. To start Discourse, run:

{% highlight php %}
$ source /home/discourse/.rvm/scripts/rvm
{% endhighlight %}

{% highlight php %}
RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ROOT=/home/discourse/discourse RAILS_ENV=production UM_WEBS=2 bluepill --no-privileged -c ~/.bluepill load /home/discourse/discourse/config/discourse.pill
{% endhighlight %}

You should also configure Discourse to start at bootup by adding this to the discourse user's crontab. Open up your crontab for editing:

{% highlight php %}
crontab -e
{% endhighlight %}

And paste the following line into the editor that pops up:

{% highlight php %}
@reboot RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ROOT=/home/discourse/discourse RAILS_ENV=production NUM_WEBS=2 /home/discourse/.rvm/bin/bootup_bluepill --no-privileged -c ~/.bluepill load /home/discourse/discourse/config/discourse.pill
{% endhighlight %}

Discourse is now running, but ngnix needs to be configured to forward requests to the running Discourse server before it will answer requests sent to your hostname.

##Step 7: Configure ngnix

Now configure ngnix to point to the Discourse instance.

Log back in and execute these commands as the local user, not as discourse.

###Base ngnix configuration

There's a small change you'll need to make to the configuration. Open the /etc/nginx/nginx.conf file:

{% highlight php %}
sudo vi /etc/nginx/nginx.conf
{% endhighlight %}

Find the http section of the file and add the following line:

{% highlight php %}
server_names_hash_bucket_size 64; 
{% endhighlight %}

###Configure nginx for Discourse

Discourse comes with an example nginx configuration file. Copy the example Discourse ngnix configuration to where ngnix expects it:

{% highlight php %}
sudo cp /home/discourse/discourse/config/nginx.sample.conf /etc/nginx/conf.d/discourse.conf 
{% endhighlight %}

There are a few changes that need to be made to this file. Open the 

/etc/nginx/conf.d/discourse.conf' file:

{% highlight php %}
sudo vi /etc/nginx/conf.d/discourse.conf 
{% endhighlight %}

###Change server_name to your hostname.

Change the socket paths to reflect where Discourse is installed. They should look like this:

{% highlight php %}
 upstream discourse { 
   server unix:/home/discourse/discourse/tmp/sockets/thin.0.sock; 
   server unix:/home/discourse/discourse/tmp/sockets/thin.1.sock; 
   server unix:/home/discourse/discourse/tmp/sockets/thin.2.sock; 
   server unix:/home/discourse/discourse/tmp/sockets/thin.3.sock; 
 } 
 proxy_cache_path /var/nginx/cache keys_zone=one:512k max_size=200m; 
{% endhighlight %}

Change the base path in the file. Look for a line with a path /var/www/discourse/public and replace this with our correct path, /home/discourse/discourse/public.

Now stop httpd to free the 80 port and restart ngnix to pick up the configuration changes:

{% highlight php %}
sudo /etc/init.d/nginx stop
sudo fuser -k 80/tcp
sudo /etc/init.d/nginx start 
{% endhighlight %}

The stop command may fail if ngnix wasn't currently running, but the start command should succeed.

auto start nginx after boot:

{% highlight php %}
chkconfig nginx on 
{% endhighlight %}

##Step 8: Use Discourse!

Discourse is now running and responding to requests at your hostname. The last thing you'll need to do is set up an admin account to give you permission to administrate the Discourse instance.

###Create your Discourse user

Open your Discourse website by navigating to your hostname in your webbrowser. Create a user account for yourself and make note of the email address with which you sign up.

###Grant yourself administrative priveleges

Return back to your shell. Become the discourse user and bring up a rails console connected to the Discourse instance:

{% highlight php %}
cd ~/discourse
RAILS_ENV=production bundle exec rails c 
{% endhighlight %}

This will drop you into a Rails console where you can run commands. These commands will grant you administrative access; replace the email address with the email address you signed up with:

{% highlight php %}
me = User.find_by_username_or_email('myemailaddress@me.com')
me.activate
me.admin = true
me.save 
{% endhighlight %}

You can also set this user as the default contact, as well:

{% highlight php %}
SiteSetting.site_contact_username = me.username 
{% endhighlight %}

Type exit to quit the Rails console.

Verify you are now an administrator

Return back to your Discourse instance in your webbrowser. If you're not logged in as the account you signed up for, log back in. You will now be able to configure your Discourse instance to your liking.

Congratulations! You've installed Discourse. Huzzah!

--------------------------------------------------------

##Some useful commands for maintenance  

###Start discourse

{% highlight php %}
RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ROOT=/home/discourse/discourse RAILS_ENV=production NUM_WEBS=2 /home/discourse/.rvm/bin/bootup_bluepill --no-privileged -c ~/.bluepill load /home/discourse/discourse/config/discourse.pill 
{% endhighlight %}

###Simple script to update

{% highlight php %}
#!/bin/bash
#Backup first, set the path to store backups 
DATESTAMP=$(TZ=UTC date +%F-%T)
pg_dump --no-owner --clean discourse | gzip -c > ~/discourse-db-$DATESTAMP.sql.gz
tar cfz ~/discourse-dir-$DATESTAMP.tar.gz -C /home/discourse discourse
# Update Discourse to master branch
git checkout master
git pull origin master
git fetch --tags
bundle install --without test --deployment
RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ENV=production bundle exec rake db:migrate
RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ENV=production bundle exec rake assets:precompile
RUBY_GC_MALLOC_LIMIT=90000000 RAILS_ROOT=/home/discourse/discourse RAILS_ENV=production NUM_WEBS=2 /home/discourse/.rvm/bin/bootup_bluepill --no-privileged -c ~/.bluepill load /home/discourse/discourse/config/discourse.pill
{% endhighlight %}

Error fetching message: Error connecting to Redis on localhost:6379 (Errno::ECONNREFUSED)

sudo service redis restart


