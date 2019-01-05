<?php

class item extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('items_model');
        $this->load->library('session');
        $this->load->helper('url_helper');
    }

    /**
     * Check admin
     * @return bool
     */
    public function is_admin()
    {
        return ($this->session->user_type === '1');
    }

    /**
     * Check overdue
     * @param $alive_time : int
     * @return bool
     */
    public function is_overdue($alive_time)
    {
        return (time() > $alive_time);
    }

    /**
     * Check login
     * @return bool
     */
    public function is_logined()
    {
        if ($this->session->user_id === NULL) {
            return false;
        } else {
            $session_alive_time = $this->session->session_alive_time;
            if ($this->is_overdue($session_alive_time)) {
                return false;
            } else {
                return true;
            }
        }
    }

    /****************************************************管理员**************************************************************************/
    /**
     * 查询  显示所有商品
     */
    public function items()
    {
        $data['items'] = $this->items_model->get_items();
        echo json_encode(array('items' => $data['items']));
    }

    /**
     * 查询  根据id进行查询
     */
    public function finditemById($item_id)
    {
        $data['item'] = $this->items_model->get_items($item_id);
        if (empty($data['item'])) {
            echo json_encode(array(
                'status' => -1
            ));
        } else {
                echo json_encode(array(
                    'status' => 1,
                    'item' => $data['item']
                ));
        }
    }

    //delete管理员通过item_id删除商品
    public function deleteItemById($item_id)
    {
        if ($this->is_logined() === false || $this->is_admin() === false) {
            die(json_encode(array(
                'status' => 0,
                'message' => 'You don\'t have permission to access this!'
            )));
        }

        $this->items_model->deleteItemById($item_id);
    }

    //insert管理员插入一个商品
    public function set_item()
    {
        if ($this->is_logined() === false || $this->is_admin() === false) {
            die(json_encode(array(
                'status' => 0,
                'message' => 'You don\'t have permission to access this!'
            )));
        }

        $this->load->helper('form');
        $this->load->library('form_validation');

        $this->form_validation->set_rules('number', 'Number', 'trim|required');
        $this->form_validation->set_rules('name', 'Name', 'trim|required');
        $this->form_validation->set_rules('price', 'Price', 'trim|required');
        $this->form_validation->set_rules('amount', 'Amount', 'trim|required');
        $this->form_validation->set_rules('type', 'Type', 'trim|required');
        $this->form_validation->set_rules('size', 'Size', 'trim|required');
        $this->form_validation->set_rules('description', 'Description', 'trim|required');
        $this->form_validation->set_rules('active', 'Active', 'trim|required');

        if ($this->form_validation->run() === FALSE) {
            die(json_encode(array(
                'status' => 0,
                'message' => 'Form validation failed!'
            )));
        }

        $item = array(
            'number' => $this->input->post('number'),
            'name' => $this->input->post('name'),
            'price' => $this->input->post('price'),
            'amount' => $this->input->post('amount'),
            'type' => $this->input->post('type'),
            'avatar' => 'unknown',
            'size' => $this->input->post('size'),
            'description' => $this->input->post('description'),
            'add_time' => time(),
            'active' => $this->input->post('active')
        );

        if ($this->items_model->insert_item($item) === false) {
            die(json_encode(array(
                'status' => 0,
                'message' => 'Failed to add item!'
            )));
        }

        echo json_encode(array(
            'status' => 1,
            'message' => 'Add item successfully!'
        ));
    }

    //update管理员通过item_id修改商品名称
    public function update_itemNameById($item_id)
    {
        if ($this->is_logined() === false || $this->is_admin() === false) {
        die(json_encode(array(
            'status' => 0,
            'message' => 'You don\'t have permission to access this!'
        )));
    }
        $this->items_model->updateItemById($item_id);
    }

    //商品被购买后surplus（剩余量）-1
    public function surplusDecrease($item_id)
    {
        $item = $this->items_model->get_items($item_id);
        $surplus = --$item['surplus'];
        $this->items_model->changeItemSurplus($item_id, $surplus);
    }

    /****************************************************购物车******************************************************************************/
    /*
     * 购物车中显示商品
     *参数： user_id
     * */
    public function get_itemsInCart()
    {
        $data = $this->Items_model->getItemsByUserId($this->session->uer_id);
        if (Empty($data)) {
            echo json_encode(array('status' => -1));
        } else {
            echo json_encode(array('status' => 1, 'items' => $data));
        }
    }

    /*
     * 购物车中删除商品
     * 参数：user_id,item_id*/
    public function deleteItemInCart($item_id)
    {
        return $this->Items_model->deleteItemfromCart($this->session->uer_id, $item_id);
    }

    /*
     * 购物车中增加商品
     * 参数：user_id,item_id*/
    public function insertItemInCart($item_id)
    {
        return $this->Items_model->putItemIntoCart($this->session->uer_id, $item_id);
    }
}

?>
