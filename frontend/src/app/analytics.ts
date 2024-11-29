import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleAnimation } from 'src/app/shared/animations';
import { ClientService } from './service/client.service';

@Component({
    templateUrl: './analytics.html',
    animations: [toggleAnimation],
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
    store: any;
    totalVisit: any;
    paidVisit: any;
    uniqueVisitor: any;
    isLoading = true;
    totalClients: number = 0;
    closedClientsCount: number = 0;
    dailyClientsCount: { date: string, count: number }[] = [];
    dailyClosedCounts: number[] = [];
    dailyCounts: number[] = [];
    closedClientsPercentage: number = 0;
    openClientsPercentage: number = 0;
    monthlyClientsStatus: { name: string, data: number[],color: string }[] = [];
    monthlyClientsStatusnamedata: { name: string, data: number[] }[] = [];
    monthlyClientsStatuscolor: string[] = [];

    constructor(public storeData: Store<any>, private clientService: ClientService) {
        this.initStore();
        this.isLoading = false;
    }

    ngOnInit() {
        this.loadTotalClients();
        this.loadClosedClients();
        this.loadDailyClientsCount();
        this.loadDailyClosedClientsCount();
        this.loadClientsCountByStatusMonthly();
    }

    ngAfterViewInit() {
        // Trigger a resize event to ensure charts are rendered correctly
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }

    loadTotalClients() {
        this.clientService.getTotalClientsCount().subscribe(
            (response) => {
                this.totalClients = response.total;
                this.calculateClientPercentages();
            },
            (error) => {
                console.error('Erreur lors de la récupération du nombre total de clients:', error);
            }
        );
    }

    loadClosedClients() {
        this.clientService.getClosedClientsCount().subscribe(
            (response) => {
                this.closedClientsCount = response.total;
                this.calculateClientPercentages();
            },
            (error) => {
                console.error('Erreur lors de la récupération du nombre de clients fermés:', error);
            }
        );



    }

    loadDailyClientsCount() {
        this.clientService.getDailyClientsCount().subscribe(
            (response) => {
                this.dailyClientsCount = response;
                this.dailyCounts = this.dailyClientsCount.map(item => item.count);
                this.totalVisit.series=[{
                    data:this.dailyCounts
                }

                ]
            },
            (error) => {
                console.error('Erreur lors de la récupération du nombre de clients ajoutés chaque jour:', error);
            }
        );
    }

    loadDailyClosedClientsCount() {
        this.clientService.getDailyClosedClientsCount().subscribe(
            (response) => {
                this.dailyClosedCounts = response.map(item => item.count);
                this.paidVisit.series=[{
                    data:this.dailyClosedCounts
                }

                ]
                // Vous pouvez utiliser ces données pour un autre graphique ou traitement
            },
            (error) => {
                console.error('Erreur lors de la récupération du nombre de clients fermés chaque jour:', error);
            }
        );
    }

    loadClientsCountByStatusMonthly() {
        this.clientService.getClientsCountByStatusMonthly().subscribe(
            (response) => {
                this.monthlyClientsStatus = response;
                console.log('Monthly Clients Status:', this.monthlyClientsStatus);
                this.monthlyClientsStatusnamedata = response.map(({ name, data }) => ({ name, data }));
                this.monthlyClientsStatuscolor = response.map(({ color }) => color);
                this.uniqueVisitor.series=this.monthlyClientsStatusnamedata;
                this.uniqueVisitor.colors=this.monthlyClientsStatuscolor;
            },
            (error) => {
                console.error('Erreur lors de la récupération du nombre de clients par statut mensuel:', error);
            }
        );
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                const hasChangeTheme = this.store?.theme !== d?.theme;
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;


                this.store = d;

                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                        this.initCharts(); //init charts
                    } else {
                        setTimeout(() => {
                            this.initCharts(); // refresh charts
                        }, 300);
                    }
                }
            });
    }

    initCharts() {
        console.log('initCharts called');
        console.log('Data for chart:', this.dailyCounts);
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // statistics
        this.totalVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#009688',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#ffffff'] : ['#009688'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [],
                },
            ],
        };

        // paid visit
        this.paidVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#ffffff'] : ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [],
                },
            ],
        };

        // unique visitors
        this.uniqueVisitor = {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: isDark ? ['#ffffff', '#cccccc'] : ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter: (val: any) => {
                        return val;
                    },
                },
            },
            series: [
                {
                    name: '',
                    data: [],
                },

            ],
        };
    }

    calculateClientPercentages() {
        if (this.totalClients > 0) {
            this.closedClientsPercentage = (this.closedClientsCount / this.totalClients) * 100;
            this.openClientsPercentage = 100 - this.closedClientsPercentage;


        }
    }
}
