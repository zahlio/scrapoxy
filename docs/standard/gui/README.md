![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Manage Scrapoxy with a GUI

## Table of contents

- [Connect](#connect)
- [Login](#login)
- [Dashboard](#dashboard)
- [Page: Instances](#page-instances)
    - [Scaling](#scaling)
    - [Status of an instance](#status-of-an-instance)
    - [Remove an instance](#remove-an-instance)
- [Page: Stats](#page-stats)
    - [Global](#global)
    - [Requests](#requests)
    - [Flow](#flow)
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

To login page redirects to the Instances page.


## Page: Instances


### Scaling

![Scaling](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_scaling.jpg)

This panel shows the number of instances.

Scrapoxy has 3 settings:

- **Min**. The desired count of instances when Scrapoxy is asleep;
- **Max**. The desired count of instances when Scrapoxy is awake;
- **Required**. The count of actual instances.

To add or remove an instance, click on the **Scaling** button and change the **Required** setting:

![Scaling_change](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_scaling_change.jpg)


### Status of an instance

![Instance](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance.png)

Each instance is described in a panel.

This panel contains many information:

- Name of the instance;
- IP of the instance;
- Provider type;
- Instance status on the provider;
- Instance status in Scrapoxy.

Scrapoxy relays requests to instances which are **started** and **alived**
(![Started](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_started.png)
+
![Alive](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_alive.png)).


#### Type of provider

<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_awsec2.png"></td><td>AWS / EC2</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_instance_ovhcloud.png"></td><td>OVH Cloud</td>
  </tr>
</table>


#### Status in the provider

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

There are 3 panels in stats:

- **Global stats**. This panel contains global stats;
- **Requests**. This panel contains the count of requests;
- **Flow**. This panel contains the flow requests.


### Global

![Stats](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_stats_global.jpg)

This panel has 4 indicators:

- the total **count of requests** to monitor performance;
- the total **count of received and sent data** to control the volume of data;
- the total of **stop instance orders**, to monitor anti-blacklisting;
- the **count of requests received by an instance** (minimum, average, maximum) to check anti-blacklisting performance.


### Requests

![Stats](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_stats_requests.jpg)

This panel combines 2 statistics on 1 chart.

It measures:

- the **count of requests** per minute;
- the **average execution time** of a request (round trip), per minute.


### Flow

![Stats](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/gui_manual/gui_stats_flow.jpg)

This panel combines 2 statistics on 1 chart.

It measures:

- the flow **received** by Scrapoxy;
- the flow **sent** by Scrapoxy.


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
