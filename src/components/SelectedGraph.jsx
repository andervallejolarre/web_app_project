import Graphic1 from '../assets/Plant_Graphic_10.svg?react'
import Graphic2 from '../assets/Plant_Graphic_9.svg?react'
import Graphic3 from '../assets/Plant_Graphic_8.svg?react'
import Graphic4 from '../assets/Plant_Graphic_7.svg?react'
import Graphic5 from '../assets/Plant_Graphic_6.svg?react'
import Graphic6 from '../assets/Plant_Graphic_5.svg?react'
import Graphic7 from '../assets/Plant_Graphic_4.svg?react'
import Graphic8 from '../assets/Plant_Graphic_3.svg?react'
import Graphic9 from '../assets/Plant_Graphic_2.svg?react'
import Graphic10 from '../assets/Plant_Graphic_1.svg?react'

function SelectedGraph(props){

            const graphic = {
                0: Graphic1,
                1: Graphic2,
                2: Graphic3,
                3: Graphic4,
                4: Graphic5,
                5: Graphic6,
                6: Graphic7,
                7: Graphic8,
                8: Graphic9,
                9: Graphic10
            }
            const PlantGraph =graphic[props.level];

            if (!PlantGraph) return null

            return(
                <div className= "svg">
                    <PlantGraph className="plantBox" />
                </div>
            )
}

export default SelectedGraph