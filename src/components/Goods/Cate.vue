<template>
    <div class="card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 内容主体 -->
      <el-card>
          <el-row>
              <el-col> 
                  <el-button type="primary" @click="fenleiDialog">添加分配</el-button>
              </el-col>
          </el-row>
          <!-- 表格区域 -->
          <tree-table  :data='cateList' :columns='columns' :selection-type='false' 
          :expand-type='false' show-index index-text="#" border :show-row-hover="false" class='treeTable'>
            <!-- 第二列 ‘是否生效’ -->
            <template slot="isUsed" slot-scope='scope'>
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                <i class="el-icon-error" v-else style="color: red"></i>
            </template>
            <!-- 第三列 ‘排序’ -->
            <template slot='order' slot-scope="scope">
                    <el-tag size='mini' v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size='mini' v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size='mini' v-else>三级</el-tag>
            </template>
            <!-- 第四列 ‘操作’ -->
            <template slot='option'>
                <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
            </template>
          </tree-table>
      </el-card>
     <!-- 底部分页区域 -->
     <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
     :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
     layout="total, sizes, prev, pager, next, jumper" :total="total">
     </el-pagination>
     <!-- 添加分类按钮 -->
     <el-dialog title="添加分类" :visible.sync="FenleiDialogVisible" width="50%" @close="closeFenLeiDiolag">
         <el-form ref="addCateFromRef" :model="addCateFrom" :rules="addCateFromRules" label-width="100px">
             <el-form-item label="分类名称:" prop="cat_name">
                 <el-input v-model="addCateFrom.cat_name"></el-input>
             </el-form-item>
             <!-- cascader 级联选择器 -->
             <el-form-item label="父类分级"> 
                 <!-- options 数据源   props 配置对象-->
                 <el-cascader expand-trigger="hover" :options="fenLeiDiolagList" :props="cascaderProps" 
                 v-model="fenLeiDiolagKeys" @change="fenLeiDiolagChange" clearable change-on-select>
                 </el-cascader>
             </el-form-item>
         </el-form>

         <div slot="footer">
             <el-button @click="FenleiDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="addCate">确 定</el-button>
         </div>
     </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类数据列表
            cateList: [],
            // 总数据条数
            total: 0,
            // 表格模板
            columns: [{
                label: '分类',
                prop: 'cat_name'
                }, {
                label: '是否有效',
                type: 'template', // 自定义模板
                template: 'isUsed'
                }, {
                label: '排序',
                type: 'template',
                template: 'order'
                }, {
                label: '操作',
                type: 'template',
                template: 'option'
                }
            ],
            FenleiDialogVisible: false,
            // 添加分类表单数据对象
            addCateFrom: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            },
            addCateFromRules: {
                cat_name: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
               // 分类表单数据中父级分类数据
                fenLeiDiolagList: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children' 
                },
                // 选中的分类id数组
                fenLeiDiolagKeys: []
            
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
       async getCateList() {
           const { data: res } = await this.$axios.get('categories', { params: this.queryInfo });
           if (res.meta.status !== 200) return this.$message.error('获取分类信息失败');
           this.cateList = res.data.result;
           this.total = res.data.total;
        },
        // 页面pagesize变化 
        handleSizeChange(pagesize) {
            this.queryInfo.pagesize = pagesize;
            this.getCateList();
        },
        handleCurrentChange(pagenum) {
            this.queryInfo.pagenum = pagenum;
            this.getCateList();
        },
        // 添加分类对话框显示
        fenleiDialog() {
            this.getFenLeiDiolagList();
            this.FenleiDialogVisible = true;
        },
          // 获取分类数据列表
          async getFenLeiDiolagList() {
              const { data: res } = await this.$axios.get('categories', { params: { type: 2 } });
              if (res.meta.status !== 200) return this.$message.error('获取数据失败');
              this.fenLeiDiolagList = res.data;
          },
          // 选中项发生了变化   
          fenLeiDiolagChange() {

          },
          closeFenLeiDiolag() {
              this.$refs.addCateFromRef.resetFields(); // 清空文本
              this.fenLeiDiolagKeys = [];
              this.cat_level = 0;
              this.cat_pid = 0;      
          },
          addCate() {
              this.$refs.addCateFromRef.validate(async valid => {
                  if (valid) {
                      const { data: res } = await this.$axios.post('categories', this.addCateFrom);
                      if (res.meta.status !== 201) return this.$message.error(res);
                      this.$message.success('添加成功');
                      this.getCateList();
                      this.FenleiDialogVisible = false;
                  }
              })
          }
    
    }
}
</script>

<style lang='less' scpoed>
.card {
    width: 100%;
    margin: 15px;
}
.treeTable {
    margin: 10px 0;
}
.el-cascader {
    width: 100%;
}
</style>