
#ifndef __tire_node_h__
#define __tire_node_h__

#include <vector>
#include <initializer_list>

#include "glm/vec2.hpp"
#include "glm/mat4x4.hpp"

#include "Point.h"
#include "Normal.h"

namespace tire {

template <typename pType_ = tire::point3f>
struct node {
        using value_type = pType_::value_type;
        
        using vec2_type = glm::vec<2, value_type>;
        using vec3_type = glm::vec<3, value_type>;
        using mat3x3_type = glm::mat<3, 3, value_type>;
        using mat4x4_type = glm::mat<4, 4, value_type>;

        void setOffset(vec3_type offst) {
            offset_ = offst;
            dirty_ = true;
        }

        void setRotate(mat3x3_type rtn) {
            rotation_ = rtn;
            dirty_ = true;
        }

        void setScale(mat3x3_type scl) {
            scale_ = scl;
            dirty_ = true;
        }

        void applyRotate() {
            if (dirty_) {
                for (auto i = 0; i < vertecies_; ++i) {
                    vertecies_[i].transform(rotation_);
                }
                dirty_ = false;
            }
        }

        void applyScale() {
            if (dirty_) {
                for (auto i = 0; i < vertecies_; ++i) {
                    vertecies_[i].transform(scale_);
                }
                dirty_ = false;
            }
        }

        void setVertecies(std::vector<pType_>::const_iterator start,
                          std::vector<pType_>::const_iterator end) {
            std::copy(start, end, begin(vertecies_));
        }

        void setVertecies(std::initializer_list<pType_> values) {
            std::copy(begin(values), end(values), begin(vertecies_));
        }

        void setIndices_(std::vector<long long>::const_iterator start,
                         std::vector<long long>::const_iterator end) {
            std::copy(start, end, begin(indices_));
        }
        void setIndices_(std::initializer_list<long long> values) {
            std::copy(begin(values), end(values), begin(indices_));
        }

        auto getVerteciesData() {
            return vertecies_.data();
        }

        auto getIndeciessData() {
            return indices_.data();
        }

    private:
        bool dirty_{ false };

        std::vector<pType_> vertecies_;
        std::vector<long long> indices_;
        std::vector<vec3_type> colors_;
        std::vector<vec2_type> texCoords_;
        std::vector<tire::normalf> normals_;

        vec3_type offset_{};
        mat3x3_type rotation_{};
        mat3x3_type scale_{};
};

}  // namespace tire

#endif