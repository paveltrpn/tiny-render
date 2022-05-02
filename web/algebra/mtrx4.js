
import {idRw} from "./common"
import {vec3, vec3Normalize} from  "./vec3"

export class mtrx4 {
    constructor() {
        this.data = new Float32Array(16)
        this.setIdtt()
    }

    setIdtt() {
        for (let i = 0; i < 16; i++) {
            if ((i % 5) == 0) {
                this.data[i] = 1.0
            } else {
                this.data[i] = 0.0
            }
        }
    }

    /**
     * Replace exist matrix with src.
     * @param {mtrx4} src - source matrix
     */
    fromMtrx4(src) {
        for (let i = 0; i < 16; i++) {
            this.data[i] = src.data[i];
        }
    }
    
    /**
     * 
     * @param {number} yaw 
     * @param {number} pitch 
     * @param {number} roll 
     */
    fromEuler(yaw, pitch, roll) {
        let cosy, siny, cosp, sinp, cosr, sinr;
        
        cosy = Math.cos(yaw);
        siny = Math.sin(yaw);
        cosp = Math.cos(pitch);
        sinp = Math.sin(pitch);
        cosr = Math.cos(roll);
        sinr = Math.sin(roll);
    
        this.data[0]  = cosy*cosr - siny*cosp*sinr;
        this.data[1]  = -cosy*sinr - siny*cosp*cosr;
        this.data[2]  = siny * sinp;
        this.data[3]  = 0.0;
        
        this.data[4]  = siny*cosr + cosy*cosp*sinr;
        this.data[5]  = -siny*sinr + cosy*cosp*cosr;
        this.data[6]  = -cosy * sinp;
        this.data[7]  = 0.0;
        
        this.data[8]  = sinp * sinr;
        this.data[9]  = sinp * cosr;
        this.data[10] = cosp;
        this.data[11] = 0.0;
    
        this.data[12] = 0.0;
        this.data[13] = 0.0;
        this.data[14] = 0.0;
        this.data[15] = 1.0;
    }

    /**
     * 
     * @param {vec3} axis 
     * @param {number} phi 
     */
    fromAxisAngl(axis, phi) {
        let cosphi, sinphi, vxvy, vxvz, vyvz, vx, vy, vz;
        let ax = new vec3();
        ax = vec3Normalize(axis);
    
        cosphi = Math.cos(phi);
        sinphi = Math.sin(phi);
        vxvy = ax.data[0] * ax.data[1];
        vxvz = ax.data[0] * ax.data[2];
        vyvz = ax.data[1] * ax.data[2];
        vx =   ax.data[0];
        vy =   ax.data[1];
        vz =   ax.data[2];
    
        this.data[0]  = cosphi + (1.0-cosphi)*vx*vx;
        this.data[1]  = (1.0-cosphi)*vxvy - sinphi*vz;
        this.data[2]  = (1.0-cosphi)*vxvz + sinphi*vy;
        this.data[3]  = 0.0;
    
        this.data[4]  = (1.0-cosphi)*vxvy + sinphi*vz;
        this.data[5]  = cosphi + (1.0-cosphi)*vy*vy;
        this.data[6]  = (1.0-cosphi)*vyvz - sinphi*vx;
        this.data[7]  = 0.0;
    
        this.data[8]  = (1.0-cosphi)*vxvz - sinphi*vy;
        this.data[9]  = (1.0-cosphi)*vyvz + sinphi*vx;
        this.data[10] = cosphi + (1.0-cosphi)*vz*vz;
        this.data[11] = 0.0;
    
        this.data[12] = 0.0;
        this.data[13] = 0.0;
        this.data[14] = 0.0;
        this.data[15] = 1.0;
    }

    /**
     * Matrix multiplication. Put result in this.
     * @param {mtrx4} a - matrix
     */
    mult(a) {
        let i, j, k, tmp;
        let rt = new mtrx4();
        
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                tmp = 0.0;
                
                for (k = 0; k < 4; k++) {
                    tmp = tmp + this.data[(idRw(k, j, 4))] * a.data[(idRw(i, k, 4))];
                }
                
                rt.data[(idRw(i, j, 4))] = tmp;
            }
        }
    
        this.fromMtrx4(rt);
    }
}