![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# GUI Manual

## Table of contents

- [Connect](#connect)
- [Login](#login)
- [Dashboard](#dashboard)
- [Page: Instances](#page-instances)
    - [Scaling](#scaling)
    - [Status of an instance](#status-of-an-instance)
    - [Remove an instance](#remove-an-instance)
- [Page: Stats](#page-stats)
    - [How to increase the number of requests per minute?](#how-to-increase-the-number-of-requests-per-minute-)
    - [Do I overload the target website?](#do-i-overload-the-target-website-)


## Connect

You can access to the GUI at *http://localhost:8889/*


## Login

![Login](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_login.png)

Enter your password.

The password is defined in the configuration file, key **commander.password**.


## Dashboard

![General](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_general.jpg)

Scrapoxy GUI has many pages:

- **Instances**. This page contains the list of instances managed by Scrapoxy;
- **Stats**. This page contains statistics on the use of Scrapoxy.


## Page: Instances


### Scaling

![Scaling](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_scaling.jpg)

This panel manages the number of instances.

Scrapoxy has 3 settings:

- **Min**. The desired count of instances when Scrapoxy is asleep;
- **Max**. The desired count of instances when Scrapoxy is awake;
- **Required**. The count of actual instances.

To add or remove an instance, simply change the **Required** setting.


### Status of an instance

![Instance](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance.png)

Each instance is described in a panel.

This panel contains many information:

- Name of the instance;
- Cloud type;
- Instance status on the cloud;
- Instance status in Scrapoxy.

Scrapoxy relays requests to **started**
(![Started](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_started.png))
and **alived**
(![Alive](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_alive.png))
instances.


#### Type of cloud

<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_awsec2.png"></td><td>AWS EC2</td>
  </tr>
</table>


#### Status in the cloud

<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_starting.png"></td><td>Starting</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_started.png"></td><td>Started</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_stopping.png"></td><td>Stopping</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_stopped.png"></td><td>Stopped</td>
  </tr>
</table>


#### Status in Scrapoxy

<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_alive.png"></td><td>Alive</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_dead.png"></td><td>Dead</td>
  </tr>
</table>
    

### Remove an instance

![Instance_del](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_del.png)

Click an instance to delete it.

The instance stops and is replaced by another.


## Page: Stats

![Stats](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_stats_requests.jpg)

Scrapoxy combines 2 statistics on 1 chart.

It measures:

- the count of requests per minute;
- the average execution time of a request (round trip), per minute.


### How to increase the number of requests per minute ?

You add new instances (or new scrapers).

Do you increase the number of requests par minute ?

- **Yes**: Perfect!
- **No**: You pay instances for nothing.


### Do I overload the target website ?

You add new instances (or new scrapers).

Did the time of response increase ?

- **Yes**: The target website is overloaded.
- **No**: Perfect!
