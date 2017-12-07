import React from 'react'

const Icon = ({rotate, color = '#000', ...props}) => (
  <svg {...props} viewBox='0 0 135 130' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>

    <path d='M126.326209,68.9694003 C126.761676,70.3541531 127.197143,71.7389059 127.523743,73.1790488 C128.612411,78.2749391 128.884578,83.4816097 128.775711,88.6882802 C128.721278,91.7347364 128.666844,94.7811926 128.12251,97.8276488 C127.142709,103.42205 124.693207,108.35177 121.318338,112.782979 C116.0383,119.651353 109.342994,124.747243 101.831187,128.846112 C101.341287,129.123062 100.796953,129.344623 100.307052,129.621573 C99.980452,129.843134 99.7627185,129.732353 99.5994183,129.400013 C96.7144491,125.134974 95.1903144,120.537595 95.5713481,115.330924 C95.843515,111.453616 97.2043495,107.964039 99.1639513,104.696023 C100.252619,102.923539 101.504587,101.317226 102.865421,99.6555225 C99.7082851,100.597154 96.6055823,101.594176 93.3395794,100.209424 C94.3738137,99.932473 95.4624813,99.7109126 96.4967156,99.3785719 C100.579219,98.1045993 104.062956,95.944385 106.512458,92.2886375 C108.254326,89.6299122 109.12526,86.6942362 109.45186,83.5923899 C110.050628,77.9425985 109.016393,72.4589773 107.437825,67.0307463 C106.458024,63.6519495 105.206057,60.439323 103.736355,57.2266965 C103.518622,56.7281854 103.300888,56.3958448 102.647688,56.7281854 C101.776754,57.1159162 100.905819,56.9497459 100.307052,56.1188942 C100.089319,55.7865535 99.9260186,56.008114 99.7082851,56.1188942 C98.6740508,56.6727953 98.2385838,56.5620151 97.8031167,55.4542129 C97.6398166,55.0664821 97.4765164,55.2880425 97.3132163,55.3434326 C96.0612485,56.008114 95.0814476,56.9497459 94.2649469,58.0575481 C92.6319455,60.2731526 91.8154447,62.8210978 91.4344111,65.5352133 C91.1078108,67.8062079 90.0191431,69.7448618 88.712742,71.5727355 C85.7733394,75.8931643 82.1263028,79.5489117 78.3703995,83.0384888 C77.3905986,83.9801207 76.3563643,84.8663625 75.3221301,85.7526043 C73.6346953,87.1927472 73.1992282,89.076011 73.4169617,91.1808353 C73.6891286,94.1719014 74.886663,96.8860169 76.1930642,99.4893522 C78.1526659,103.31127 80.6021681,106.800847 83.2149704,110.179644 C83.4871373,110.567375 83.4871373,110.733545 83.2149704,111.065886 C81.7997025,112.727589 80.0034009,113.835391 78.0982326,114.832413 C73.7979954,117.048018 69.2800247,118.432771 64.6531873,119.651353 C56.1615797,121.866958 47.506672,123.362491 38.8517644,124.581073 C32.6463588,125.467315 26.4953867,126.187386 20.2355478,126.796678 C15.8808773,127.239798 11.4717734,127.627529 7.11710283,127.90448 C6.57276901,127.95987 6.51833563,127.738309 6.57276901,127.295189 C6.84493592,125.411925 7.55256988,123.694831 8.36907061,122.033128 C10.4919725,117.768089 13.268075,113.946171 16.0986108,110.124254 C20.0722477,104.862193 24.3180514,99.8216928 28.7271554,94.9473629 C29.0537557,94.6150223 28.9993223,94.3934618 28.7815887,94.0611211 C27.2030207,91.5685661 25.0256854,89.7406924 22.5761832,88.3005495 C19.8000808,86.6942362 16.8606782,85.586434 13.7579754,84.8663625 C12.4515742,84.5894119 11.0907397,84.7001922 9.78433853,84.3678515 C7.77030341,83.9247306 5.86513505,83.2600492 4.50430051,81.5983459 C2.92573244,79.6043018 2.38139862,77.3886973 3.30676611,74.8961423 C3.95996669,73.1236587 3.95996669,71.4065652 3.0345992,69.7448618 C2.87129906,69.4679113 2.70799891,69.1909607 2.435832,68.9694003 C1.72819804,68.360109 1.67376466,67.6954277 2.27253186,66.9753562 C2.435832,66.7537958 2.65356553,66.5322353 2.87129906,66.366065 C3.08903258,66.1998947 3.30676611,66.0337243 3.57893302,65.867554 C3.47006626,65.6459935 3.25233273,65.6459935 3.08903258,65.5906034 C2.38139862,65.2582627 1.89149819,64.7597517 1.61933128,63.9842902 C1.45603113,63.430389 1.40159775,62.9872681 1.94593157,62.4887571 C2.59913215,61.934856 3.0345992,61.1593944 3.25233273,60.2731526 C3.52449964,59.1099603 3.57893302,58.002158 2.54469877,57.1159162 C2.00036495,56.6174052 1.61933128,56.008114 1.29273099,55.3434326 C-0.176970317,52.7400974 0.585097027,50.3583225 3.19789935,49.0289598 C5.48410138,47.8657675 7.55256988,46.3148443 9.18557133,44.2654102 C9.51217162,43.8776794 9.56660501,43.7115091 9.02227119,43.4899486 C6.73606916,42.6037068 4.77646742,41.218954 3.36119949,38.8925693 C4.17770022,39.3356902 4.77646742,39.6680309 5.48410138,40.0003715 C7.00823607,40.720443 8.53237075,41.218954 10.2198056,41.3851243 C10.6552726,41.4405144 10.8730062,41.3297342 10.9818729,40.8312232 C11.2540398,39.723421 11.3629066,38.5602286 11.2540398,37.3970362 C11.2540398,37.2308659 11.2540398,36.9539153 11.0363063,36.9539153 C10.7641394,36.9539153 10.8730062,37.2308659 10.8730062,37.3416461 C10.709706,38.0617176 10.5464059,38.7817891 10.3831057,39.4464704 C10.2198056,39.5018605 10.4375391,39.8895913 10.1109388,39.8342012 C8.80453766,31.9688052 9.2944381,24.3249697 13.3769417,17.2904255 C15.8808773,13.0253868 19.3101803,9.7573702 23.4471173,7.15403493 C29.2714892,3.4428974 35.6946282,1.22729291 42.4988009,0.451831336 C46.9623382,-0.102069787 51.4803089,-0.0466796747 55.9982796,0.230270887 C60.6795504,0.507221448 65.3063879,1.22729291 69.8243585,2.50126549 C76.6285312,4.49530953 82.7795034,7.76332616 87.8418079,12.9146066 C92.9041124,18.0658871 96.1156819,24.2695796 97.9119835,31.2487338 C99.0006511,35.4029922 99.5449849,39.6680309 99.4361182,44.0992398 C100.198186,43.2683882 100.960253,43.4899486 101.776754,43.8222893 C102.538821,44.15463 103.246455,44.653141 103.899655,45.151652 C104.171822,45.3732124 104.443989,45.5393828 104.77059,45.650163 C105.478224,45.9271135 105.641524,46.647185 105.695957,47.3118664 C105.75039,47.8103774 105.968124,47.9211576 106.349158,48.0319378 C111.411462,49.1951302 116.256033,50.9122237 120.71957,53.6263392 C127.251576,57.6698174 131.82398,63.2642187 133.620282,70.9080542 C134.87225,76.3362852 134.654516,81.8199063 133.293682,87.1927472 C132.967081,87.1373571 133.130381,86.8604065 133.130381,86.6942362 C133.075948,85.9187746 133.184815,85.0879229 133.075948,84.3124614 C132.586048,80.2689832 131.061913,76.5578457 129.211178,72.9574884 C128.449111,71.5173454 127.63261,70.0772025 126.652809,68.7478398 C126.271775,68.6924497 126.326209,68.85862 126.326209,68.9694003 Z' fill='#545456' />
  </svg>
)
export default Icon
