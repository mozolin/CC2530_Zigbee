URL: https://github.com/mozolin/CC2530_Zigbee  
# Example: BMX280 sensors with CC2530 (PTVO Firmware Config & SmartRF Flash Programmer)  

Official PTVO docs: [How to select and flash CC2530](https://ptvo.info/how-to-select-and-flash-cc2530-144/)
  
1) connect CC2530 to SmartRF04EB (CC-Debugger)  
![](img/CC2530-UART-Wireless-Core-Development-Board-CC2530F256-Serial-Port-Wireless-Module-24GHz-For-Zigbee-1445025-2-800x800.jpg)
![](img/SmartRF04EB-CC2530_Pin_Adapter.jpg)
2) connect SmartRF04EB (CC-Debugger) to computer  
3) make .HEX-file with "PTVO. Firmware configuration" software  
![](img/_CC2530-P5LED_Reports-P13P15DS18B20.png)
4) flash (upload) firmware (.HEX-file) with "TI SmartRF Flash Programmer V1"  
   (V2 does not work with CC2530)  
5) pair CC2530 with Zigbee2MQTT  
  
СС2530 can be re-paired:  
1) power on  
2) wait 2 seconds  
3) power off  
4) repeat above steps 2 further times
5) power on and wait for it to join your network
  
![](img/CC2530-P5_LED_Reports-P13_P15_DS18B20.png)
![](img/DS18B20-СС2530-01.jpg)
