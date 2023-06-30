import React from 'react';

const BoardIcon = () => {
  // https://www.svgrepo.com/svg/83116/board-games-set

  /*
  return (
    <svg fill="#222222" width="32" height="32" viewBox="0 0 430 430">
      <g>
        <path d="M420.986,0H9C4.029,0,0,4.029,0,9v411.986c0,4.971,4.029,9,9,9h411.986c4.971,0,9-4.029,9-9V9
          C429.986,4.029,425.957,0,420.986,0z M275.492,172.495h33.497v84.996h-33.497V172.495z M172.494,185.223l29.771,29.771
          l-29.771,29.771V185.223z M185.223,172.495h59.541l-29.771,29.771L185.223,172.495z M244.764,257.491h-59.541l29.771-29.771
          L244.764,257.491z M18,172.495h33.498v84.996H18V172.495z M154.494,411.986H18V275.491h136.494V411.986z M69.498,257.491v-84.996
          h33.498v84.996H69.498z M154.494,257.491h-33.498v-84.996h33.498V257.491z M154.494,154.495h-42.498H18V18h136.494V154.495z
          M257.492,411.986h-84.998v-33.498h84.998V411.986z M257.492,360.488h-84.998V326.99h84.998V360.488z M257.492,308.99h-84.998
          v-33.499h84.998V308.99z M257.492,244.764l-29.771-29.771l29.771-29.771V244.764z M257.492,154.495h-84.998v-33.498h84.998V154.495z
          M257.492,102.997h-84.998V69.498h84.998V102.997z M257.492,51.498h-84.998V18h84.998V51.498z M411.986,411.986H275.492V275.491
          h136.494V411.986z M326.989,257.491v-84.996h33.498v84.996H326.989z M411.986,257.491h-33.499v-84.996h33.499V257.491z
          M411.986,154.495h-42.499h-93.995V18h136.494V154.495z M343.739,136.012c27.438,0,49.762-22.324,49.762-49.765
          c0-27.439-22.323-49.763-49.762-49.763c-27.441,0-49.767,22.323-49.767,49.763c0,12.316,4.537,24.139,12.775,33.289
          C316.176,130.007,329.659,136.012,343.739,136.012z M343.739,54.484c17.514,0,31.762,14.249,31.762,31.763
          c0,17.515-14.248,31.765-31.762,31.765c-8.987,0-17.595-3.834-23.614-10.52c-5.257-5.84-8.152-13.385-8.152-21.245
          C311.973,68.733,326.223,54.484,343.739,54.484z M343.739,393.503c27.438,0,49.762-22.324,49.762-49.765
          c0-27.438-22.323-49.762-49.762-49.762c-27.441,0-49.767,22.323-49.767,49.762c0,12.316,4.537,24.139,12.775,33.288
          C316.175,387.498,329.658,393.503,343.739,393.503z M343.739,311.977c17.514,0,31.762,14.248,31.762,31.762
          c0,17.515-14.248,31.765-31.762,31.765c-8.988,0-17.595-3.834-23.614-10.52c-5.257-5.84-8.152-13.385-8.152-21.245
          C311.973,326.225,326.223,311.977,343.739,311.977z M86.247,393.503c27.44,0,49.765-22.324,49.765-49.765
          c0-27.438-22.324-49.762-49.765-49.762c-27.439,0-49.764,22.323-49.764,49.762c0,12.318,4.536,24.141,12.772,33.288
          C58.683,387.498,72.166,393.503,86.247,393.503z M86.247,311.977c17.515,0,31.765,14.248,31.765,31.762
          c0,17.515-14.25,31.765-31.765,31.765c-8.988,0-17.595-3.834-23.614-10.52c-5.255-5.838-8.149-13.382-8.149-21.245
          C54.483,326.225,68.732,311.977,86.247,311.977z M86.247,136.012c27.44,0,49.765-22.324,49.765-49.765
          c0-27.439-22.324-49.763-49.765-49.763c-27.439,0-49.764,22.323-49.764,49.763c0,12.318,4.536,24.141,12.772,33.289
          C58.684,130.007,72.167,136.012,86.247,136.012z M86.247,54.484c17.515,0,31.765,14.249,31.765,31.763
          c0,17.515-14.25,31.765-31.765,31.765c-8.987,0-17.595-3.834-23.614-10.52c-5.255-5.838-8.149-13.382-8.149-21.245
          C54.483,68.733,68.732,54.484,86.247,54.484z"
        />
      </g>
    </svg>
  );
  */

  /*
  return (
    <svg fill="#222222" width="32" height="32" viewBox="0 0 1000 1000">
      <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
        <path d="M611.7,4997.2c-186.8-46.1-355.7-184.2-455.4-371L100,4521.3v-4401v-4401l53.7-115.1c66.5-148.4,194.5-276.3,342.9-342.9l115.1-53.7H5000h4388.3l115.1,53.7c148.4,66.5,276.3,194.5,342.9,342.9l53.7,115.1V107.4v4388.3l-53.7,115.1c-66.5,148.4-194.5,276.3-342.9,342.9l-115.1,53.7l-4349.9,5.1C2646,5012.6,655.3,5007.4,611.7,4997.2z M4321.9,2704.6V785.5H2402.9H483.8l-7.7,1798.8c-5.1,1988.1-12.8,1898.6,156.1,2000.9c79.3,48.6,135.6,51.2,1885.8,46.1l1803.9-7.7V2704.6z M9367.8,4585.2c168.9-102.3,161.2-12.8,156.1-2000.9l-7.7-1798.8H7597.1H5678.1l-7.7,1893.5c-2.6,1041.4,0,1908.8,7.7,1926.7c7.7,23,394.1,30.7,1809,30.7C9227,4636.4,9288.4,4633.9,9367.8,4585.2z M4820.9,2781.3V1207.7h-64h-64v1573.6V4355h64h64V2781.3z M5307.1,2781.3V1207.7h-64h-64v1573.6V4355h64h64V2781.3z M4027.7,350.5v-64H2454H880.4v64v64H2454h1573.6V350.5z M9247.5,350.5v-64H7673.9H6100.3v64v64h1573.6h1573.6V350.5z M4027.7-135.6v-64H2454H880.4v64v64H2454h1573.6V-135.6z M9247.5-135.6v-64H7673.9H6100.3v64v64h1573.6h1573.6V-135.6z M4321.9-2489.7v-1919.1l-1798.8-7.7c-1988.2-5.1-1898.6-12.8-2000.9,156.1C473.6-4181,471-4119.6,471-2384.8c0,985.1,7.7,1801.3,17.9,1809c7.7,10.3,875.1,15.4,1924.2,12.8l1908.8-7.7V-2489.7z M9523.9-2374.6c5.1-1750.2,2.6-1806.5-46.1-1885.8c-102.3-168.9-12.8-161.2-2000.9-156.1l-1798.8,7.7l-7.7,1893.5c-2.6,1041.4,0,1908.8,7.7,1926.7c7.7,25.6,406.9,30.7,1924.2,25.6l1913.9-7.7L9523.9-2374.6z M4820.9-2438.5v-1573.6h-64h-64v1573.6v1573.6h64h64V-2438.5z M5307.1-2438.5v-1573.6h-64h-64v1573.6v1573.6h64h64V-2438.5z" /><path d="M1811.8,4214.2c-258.4-56.3-440.1-156.1-639.7-355.7c-276.3-276.4-394-555.3-394-936.5c2.6-238,33.3-373.6,130.5-578.3C1120.9,1896,1579,1614.5,2095.8,1612c1166.8-5.1,1757.9,1420.1,928.8,2241.5C2689.5,4183.5,2259.6,4311.5,1811.8,4214.2z M2326.1,3830.4c184.2-48.6,401.7-191.9,506.6-332.6c140.7-194.5,179.1-312.2,181.7-562.9c2.6-202.1-5.1-250.8-71.6-391.5c-97.2-207.3-314.7-414.5-516.9-491.3c-151-56.3-412-71.6-562.9-35.8c-248.2,58.8-506.6,276.3-619.2,516.9c-58.9,125.4-69.1,179.1-69.1,388.9c0,209.8,10.2,263.5,66.5,386.4c127.9,268.7,332.6,445.2,611.5,519.4C2037,3876.5,2141.9,3876.5,2326.1,3830.4z" /><path d="M7620.2,4214.2c-578.3-125.4-1033.7-685.7-1033.7-1269.1c0-322.4,122.8-655,332.6-895.6c411.9-475.9,1166.8-580.8,1704.1-232.9c276.4,179.1,501.5,491.3,570.6,798.3c66.5,289.1,17.9,675.5-120.3,931.4c-97.2,184.2-394.1,473.4-575.7,560.4C8216.3,4242.4,7917,4278.2,7620.2,4214.2z M8257.3,3792c199.6-74.2,381.3-245.6,483.6-455.5c76.8-156.1,84.4-191.9,84.4-414.5c0-209.8-10.2-263.5-69.1-388.9c-112.6-240.5-371-458-619.2-516.9c-150.9-35.8-412-20.5-562.9,35.8c-202.1,76.8-419.6,284-516.8,491.3c-66.5,140.7-74.2,189.3-71.7,391.5c0,174,12.8,258.4,53.8,345.4C7261.9,3769,7760.9,3976.3,8257.3,3792z" /><path d="M1914.2-1402.2c-529.7-79.3-967.2-460.6-1097.7-959.5c-48.6-191.9-48.6-496.4,0-685.7c56.3-220,148.4-381.3,322.4-568c509.2-542.5,1353.6-552.7,1885.8-23c491.3,491.3,516.9,1266.6,56.3,1803.9C2814.8-1522.5,2326.1-1340.8,1914.2-1402.2z M2436.1-1842.3c81.9-30.7,191.9-102.4,284-189.4c348-319.8,404.3-813.7,140.7-1205.2c-107.5-156.1-212.4-240.5-414.5-335.2c-120.3-56.3-181.7-66.5-350.6-66.5c-371,2.6-655,174-834.2,501.5c-81.9,153.5-87,174-87,417.1c0,222.6,7.7,273.8,69.1,401.7C1453.6-1870.5,1960.2-1668.3,2436.1-1842.3z" /><path d="M7709.7-1402.2C7067.5-1499.5,6589-2062.4,6586.4-2720c-2.5-790.6,752.3-1427.8,1530.1-1292.2c506.6,84.4,939.1,475.9,1067,959.5c76.8,301.9,40.9,657.6-102.4,949.3C8845.8-1624.8,8254.7-1320.3,7709.7-1402.2z M8328.9-1875.6c174-89.6,345.4-266.1,427.3-442.7c58.8-125.4,69.1-179.1,69.1-388.9c0-225.2-7.7-258.4-84.4-414.5c-163.8-332.6-458-514.3-836.7-516.9c-179.1-2.6-227.7,7.7-376.1,79.3c-614.1,289.1-744.6,1054.2-261,1525C7538.3-1770.7,7988.6-1704.2,8328.9-1875.6z" />
      </g>
    </svg>
  );
  */

  return (
    <svg width="32" height="32" viewBox="0 0 500 500">
      <polygon points="140,140 360,140 360,360 140,360" fill="transparent" stroke="#222222" strokeWidth="75" strokeLinejoin="round" />
    </svg>
  );
};

export default BoardIcon;